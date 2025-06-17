import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert, FlatList, TouchableOpacity, Platform, Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { addTransactionLocal, loadTransactions, loadSalary, saveSalary, getMonthlyDepositsLocal } from '../services/storageService';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';


const BETTING_HOUSES = [
  'Bet365', 'Sportingbet', 'Blaze', 'EstrelaBet', 'Betano', 'Pixbet', 'Outra'
];

const OperationsScreen = () => { 
  const { currentUser } = useAuth();
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('deposit'); 
  const [bettingHouse, setBettingHouse] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [time, setTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [salary, setSalary] = useState('');
  const [showSalaryModal, setShowSalaryModal] = useState(false);
  const [warningModalVisible, setWarningModalVisible] = useState(false);
  const [depositWarningAmount, setDepositWarningAmount] = useState(0);

  const MONTHLY_DEPOSIT_WARNING_THRESHOLD = 500; 

  const fetchUserData = useCallback(async () => {
    if (!currentUser) return;
    try {
      // Carrega o salário
      const loadedSalary = await loadSalary(currentUser.id);
      setSalary(loadedSalary.toString());

      // Carrega as transações
      const loadedTransactions = await loadTransactions(currentUser.id);
      setTransactions(loadedTransactions);
    } catch (error) {
      console.error("Erro ao carregar dados na tela de operações:", error);
      Alert.alert("Erro", "Não foi possível carregar os dados das operações.");
    }
  }, [currentUser]);

  useEffect(() => {
    fetchUserData();
 
    const interval = setInterval(fetchUserData, 5000);
    return () => clearInterval(interval); 
  }, [fetchUserData]);

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const onChangeTime = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    setShowTimePicker(Platform.OS === 'ios');
    setTime(currentTime);
  };

  const handleAddTransaction = async () => {
    if (!currentUser) {
      Alert.alert("Erro", "Você precisa estar logado para adicionar transações.");
      return;
    }
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      Alert.alert("Erro", "Por favor, insira um valor válido.");
      return;
    }
    if (!bettingHouse) {
      Alert.alert("Erro", "Por favor, selecione ou digite a casa de aposta.");
      return;
    }

    const transactionData = {
      amount: parseFloat(amount),
      type: type,
      bettingHouse: bettingHouse,
      date: format(date, 'yyyy-MM-dd'),
      time: format(time, 'HH:mm'),
    };

    if (type === 'deposit') {
      const currentMonth = format(new Date(), 'yyyy-MM');
      const monthlyDeposits = await getMonthlyDepositsLocal(currentUser.id, currentMonth);
      const totalDepositedThisMonth = monthlyDeposits.reduce((sum, t) => sum + t.amount, 0);
      const newTotalDeposited = totalDepositedThisMonth + parseFloat(amount);

      if (newTotalDeposited > MONTHLY_DEPOSIT_WARNING_THRESHOLD) {
        setDepositWarningAmount(newTotalDeposited);
        setWarningModalVisible(true);

        return;
      }
    }


    await confirmAndAddTransaction(transactionData);
  };

  const confirmAndAddTransaction = async (transactionData) => {
    try {
      await addTransactionLocal(currentUser.id, transactionData);
      Alert.alert("Sucesso", `${type === 'deposit' ? 'Depósito' : 'Saque'} adicionado!`);
      // Limpar formulário
      setAmount('');
      setBettingHouse('');
      setWarningModalVisible(false); 
      fetchUserData(); 
    } catch (error) {
      Alert.alert("Erro", "Não foi possível adicionar a transação: " + error.message);
    }
  };

  const handleUpdateSalary = async () => {
    if (!currentUser) {
      Alert.alert("Erro", "Você precisa estar logado para atualizar o salário.");
      return;
    }
    if (!salary || isNaN(parseFloat(salary)) || parseFloat(salary) <= 0) {
      Alert.alert("Erro", "Por favor, insira um salário válido.");
      return;
    }
    try {
      await saveSalary(currentUser.id, parseFloat(salary));
      Alert.alert("Sucesso", "Salário atualizado!");
      setShowSalaryModal(false);
      fetchUserData(); 
    } catch (error) {
      Alert.alert("Erro", "Não foi possível atualizar o salário: " + error.message);
    }
  };

  const getPeakPlayingTime = () => {
    const hourlyDeposits = {};
    transactions.filter(t => t.type === 'deposit' && t.timestamp instanceof Date).forEach(t => {
      const hour = t.timestamp.getHours(); 
      hourlyDeposits[hour] = (hourlyDeposits[hour] || 0) + 1;
    });

    let peakHour = 'Nenhum horário registrado';
    let maxDeposits = 0;

    for (const hour in hourlyDeposits) {
      if (hourlyDeposits[hour] > maxDeposits) {
        maxDeposits = hourlyDeposits[hour];
        peakHour = `${hour}:00 - ${parseInt(hour) + 1}:00`;
      }
    }
    return peakHour;
  };

  const renderTransactionItem = ({ item }) => (
    <View style={styles.transactionItem}>
      <Text style={styles.transactionText}>Tipo: <Text style={item.type === 'deposit' ? styles.depositText : styles.withdrawText}>{item.type === 'deposit' ? 'Depósito' : 'Saque'}</Text></Text>
      <Text style={styles.transactionText}>Valor: R$ {item.amount.toFixed(2)}</Text>
      <Text style={styles.transactionText}>Casa: {item.bettingHouse}</Text>
      <Text style={styles.transactionText}>Data: {item.timestamp ? format(item.timestamp, 'dd/MM/yyyy HH:mm', { locale: ptBR }) : 'Data inválida'}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Adicionar Nova Operação</Text>

      <View style={styles.formCard}>
        <TextInput
          style={styles.input}
          placeholder="Valor (Ex: 100.50)"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />

        <View style={styles.radioGroup}>
          <TouchableOpacity
            style={[styles.radioButton, type === 'deposit' && styles.radioButtonSelected]}
            onPress={() => setType('deposit')}
          >
            <Text style={type === 'deposit' ? styles.radioTextSelected : styles.radioText}>Depósito</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.radioButton, type === 'withdraw' && styles.radioButtonSelected]}
            onPress={() => setType('withdraw')}
          >
            <Text style={type === 'withdraw' ? styles.radioTextSelected : styles.radioText}>Saque</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Casa de Aposta (Ex: Bet365)"
          value={bettingHouse}
          onChangeText={setBettingHouse}
        />
        <View style={styles.dropdown}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dropdownScroll}>
                {BETTING_HOUSES.map((house, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[styles.dropdownItem, bettingHouse === house && styles.dropdownItemSelected]}
                        onPress={() => setBettingHouse(house)}
                    >
                        <Text style={bettingHouse === house ? styles.dropdownItemTextSelected : styles.dropdownItemText}>
                            {house}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>


        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateTimeButton}>
            <Text>Data: {format(date, 'dd/MM/yyyy')}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            testID="datePicker"
            value={date}
            mode="date"
            display="default"
            onChange={onChangeDate}
          />
        )}

        <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.dateTimeButton}>
            <Text>Hora: {format(time, 'HH:mm')}</Text>
        </TouchableOpacity>
        {showTimePicker && (
          <DateTimePicker
            testID="timePicker"
            value={time}
            mode="time"
            display="default"
            onChange={onChangeTime}
          />
        )}

        <TouchableOpacity style={styles.addButton} onPress={handleAddTransaction}>
          <Text style={styles.addButtonText}>Adicionar Operação</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Seu Salário</Text>
      <View style={styles.card}>
        <Text style={styles.summaryText}>Salário Atual: R$ {parseFloat(salary || 0).toFixed(2)}</Text>
        <TouchableOpacity style={styles.updateSalaryButton} onPress={() => setShowSalaryModal(true)}>
          <Text style={styles.updateSalaryButtonText}>Atualizar Salário</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Análise de Padrões</Text>
      <View style={styles.card}>
        <Text style={styles.summaryText}>Horário de Maior Jogo (Depósitos): {getPeakPlayingTime()}</Text>
      </View>

      <Text style={styles.sectionTitle}>Extrato de Operações</Text>
      {transactions.length === 0 ? (
        <Text style={styles.noDataText}>Nenhuma operação registrada ainda.</Text>
      ) : (
        <FlatList
          data={transactions}
          renderItem={renderTransactionItem}
          keyExtractor={item => item.id}
          scrollEnabled={false} 
        />
      )}


      <Modal
        animationType="slide"
        transparent={true}
        visible={showSalaryModal}
        onRequestClose={() => setShowSalaryModal(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Atualizar Salário</Text>
            <TextInput
              style={styles.input}
              placeholder="Novo Salário"
              value={salary}
              onChangeText={setSalary}
              keyboardType="numeric"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.modalButton, styles.modalButtonClose]} onPress={() => setShowSalaryModal(false)}>
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.modalButtonSave]} onPress={handleUpdateSalary}>
                <Text style={styles.modalButtonText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={warningModalVisible}
        onRequestClose={() => setWarningModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Aviso de Depósito!</Text>
            <Text style={styles.modalMessage}>
              Você já depositou R$ {depositWarningAmount.toFixed(2)} neste mês. Tem certeza que quer continuar?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonClose]}
                onPress={() => setWarningModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSave]}
                onPress={() => confirmAndAddTransaction({
                  amount: parseFloat(amount),
                  type: type,
                  bettingHouse: bettingHouse,
                  date: format(date, 'yyyy-MM-dd'),
                  time: format(time, 'HH:mm'),
                })}
              >
                <Text style={styles.modalButtonText}>Sim, Continuar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  radioButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D4AF37',
    backgroundColor: '#fff',
  },
  radioButtonSelected: {
    backgroundColor: '#D4AF37',
  },
  radioText: {
    color: '#D4AF37',
    fontWeight: 'bold',
  },
  radioTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  dropdown: {
    height: 40,
    marginBottom: 10,
  },
  dropdownScroll: {
    alignItems: 'center',
  },
  dropdownItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    marginHorizontal: 4,
    backgroundColor: '#f0f0f0',
  },
  dropdownItemSelected: {
    backgroundColor: '#D4AF37',
    borderColor: '#D4AF37',
  },
  dropdownItemText: {
    color: '#555',
  },
  dropdownItemTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  dateTimeButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  addButton: {
    width: '100%',
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#28a745', 
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  updateSalaryButton: {
    backgroundColor: '#007bff', 
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  updateSalaryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#555',
  },
  noDataText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#777',
    fontSize: 16,
  },
  transactionItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderLeftWidth: 5,
    borderLeftColor: '#D4AF37',
  },
  transactionText: {
    fontSize: 15,
    marginBottom: 3,
    color: '#333',
  },
  depositText: {
    color: '#28a745',
    fontWeight: 'bold',
  },
  withdrawText: {
    color: '#dc3545',
    fontWeight: 'bold',
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
  },
  modalTitle: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  modalMessage: {
    marginBottom: 20,
    textAlign: "center",
    fontSize: 16,
    color: '#555',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  modalButton: {
    borderRadius: 8,
    padding: 10,
    elevation: 2,
    width: '45%',
    alignItems: 'center',
  },
  modalButtonClose: {
    backgroundColor: '#dc3545', 
  },
  modalButtonSave: {
    backgroundColor: '#D4AF37', 
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default OperationsScreen;
