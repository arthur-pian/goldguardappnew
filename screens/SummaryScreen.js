import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { loadTransactions, loadSalary } from '../services/storageService';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const SummaryScreen = () => {
  const { currentUser, loading, logout } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [salary, setSalary] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    if (!currentUser) {
      setRefreshing(false);
      return;
    }

    setRefreshing(true);
    try {

      const loadedSalary = await loadSalary(currentUser.id);
      setSalary(loadedSalary);

      const loadedTransactions = await loadTransactions(currentUser.id);
      setTransactions(loadedTransactions);
    } catch (error) {
      console.error("Erro ao carregar dados na tela de resumo:", error);
      Alert.alert("Erro", "Não foi possível carregar os dados. Tente novamente.");
    } finally {
      setRefreshing(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchData(); 
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const onRefresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  // Cálculos do resumo
  const calculateSummary = () => {
    const monthlySummary = {};
    let totalDeposited = 0;
    let totalWithdrawn = 0;
    let mostUsedOverallBettingHouse = { name: 'Nenhuma', count: 0 };
    const overallBettingHouseUsage = {};

    transactions.forEach(t => {
      const monthYear = format(t.timestamp, 'yyyy-MM');

      if (!monthlySummary[monthYear]) {
        monthlySummary[monthYear] = { entrada: 0, saida: 0, bettingHouses: {} };
      }

      if (t.type === 'deposit') {
        monthlySummary[monthYear].entrada += t.amount;
        totalDeposited += t.amount;
      } else if (t.type === 'withdraw') {
        monthlySummary[monthYear].saida += t.amount;
        totalWithdrawn += t.amount;
      }

      if (t.bettingHouse) {
        overallBettingHouseUsage[t.bettingHouse] = (overallBettingHouseUsage[t.bettingHouse] || 0) + 1;
        monthlySummary[monthYear].bettingHouses[t.bettingHouse] = (monthlySummary[monthYear].bettingHouses[t.bettingHouse] || 0) + 1;
      }
    });

    for (const house in overallBettingHouseUsage) {
      if (overallBettingHouseUsage[house] > mostUsedOverallBettingHouse.count) {
        mostUsedOverallBettingHouse = { name: house, count: overallBettingHouseUsage[house] };
      }
    }

    for (const month in monthlySummary) {
      let currentMonthMostUsed = { name: 'Nenhuma', count: 0 };
      for (const house in monthlySummary[month].bettingHouses) {
        if (monthlySummary[month].bettingHouses[house] > currentMonthMostUsed.count) {
          currentMonthMostUsed = { name: house, count: monthlySummary[month].bettingHouses[house] };
        }
      }
      monthlySummary[month].mostUsedBettingHouse = currentMonthMostUsed.name;
    }

    const currentMonthKey = format(new Date(), 'yyyy-MM');
    const currentMonthData = monthlySummary[currentMonthKey] || { entrada: 0, saida: 0 };
    const currentMonthPercent = salary > 0 ? ((currentMonthData.entrada / salary) * 100).toFixed(2) : '0.00';

    const sortedMonths = Object.keys(monthlySummary).sort((a, b) => new Date(b) - new Date(a));

    return {
      totalDeposited,
      totalWithdrawn,
      mostUsedOverallBettingHouse,
      monthlySummary,
      currentMonthPercent,
      sortedMonths,
    };
  };

  const summaryData = calculateSummary();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Carregando dados...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Bem-vindo, {currentUser?.email || 'Usuário'}!</Text>
        <TouchableOpacity onPress={() => { Alert.alert("Sair", "Tem certeza que deseja sair?", [{ text: "Não" }, { text: "Sim", onPress: logout }]); }} style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Sair</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Resumo Geral</Text>
        <Text style={styles.summaryText}>Total Depositado: R$ {summaryData.totalDeposited.toFixed(2)}</Text>
        <Text style={styles.summaryText}>Total Sacado: R$ {summaryData.totalWithdrawn.toFixed(2)}</Text>
        <Text style={styles.summaryText}>Casa de Aposta Mais Usada (Geral): {summaryData.mostUsedOverallBettingHouse.name} ({summaryData.mostUsedOverallBettingHouse.count}x)</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Gasto Atual do Salário (Mês)</Text>
        {salary === 0 ? (
          <Text style={styles.salaryWarning}>Configure seu salário na tela de Operações para calcular!</Text>
        ) : (
          <>
            <Text style={styles.summaryText}>Salário Configurado: R$ {salary.toFixed(2)}</Text>
            <Text style={styles.percentText}>
              Você está usando {summaryData.currentMonthPercent}% do seu salário em apostas este mês.
            </Text>
          </>
        )}
      </View>

      <Text style={styles.sectionTitle}>Resumo por Mês</Text>
      {summaryData.sortedMonths.length === 0 ? (
        <Text style={styles.noDataText}>Nenhuma transação registrada ainda.</Text>
      ) : (
        summaryData.sortedMonths.map(monthYear => (
          <View key={monthYear} style={styles.card}>
            <Text style={styles.cardTitle}>{format(new Date(monthYear + '-01'), 'MMMM/yyyy', { locale: ptBR })}</Text>
            <Text style={styles.summaryText}>Entrada: R$ {summaryData.monthlySummary[monthYear].entrada.toFixed(2)}</Text>
            <Text style={styles.summaryText}>Saída: R$ {summaryData.monthlySummary[monthYear].saida.toFixed(2)}</Text>
            <Text style={styles.summaryText}>Casa Mais Usada: {summaryData.monthlySummary[monthYear].mostUsedBettingHouse || 'Nenhuma'}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#555',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#D4AF37',
    paddingTop: 50,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  logoutButton: {
    padding: 8,
    backgroundColor: '#A0812A',
    borderRadius: 5,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  summaryText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#555',
  },
  percentText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginTop: 10,
  },
  salaryWarning: {
    color: 'red',
    fontStyle: 'italic',
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
    marginLeft: 10,
    color: '#333',
  },
  noDataText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#777',
    fontSize: 16,
  },
  navButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  navButton: {
    backgroundColor: '#D4AF37',
    padding: 15,
    borderRadius: 8,
    width: '45%',
    alignItems: 'center',
  },
  navButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default SummaryScreen;
