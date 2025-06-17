import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';

const educationalMessages = [
  {
    title: "Apostar é um Entretenimento, Não uma Fonte de Renda",
    content: "Lembre-se que o objetivo principal das apostas deve ser a diversão. Não encare as apostas como uma forma garantida de ganhar dinheiro ou resolver problemas financeiros. A probabilidade está sempre contra você no longo prazo.",
  },
  {
    title: "Defina Limites Claros e Cumpra-os",
    content: "Antes de começar a apostar, estabeleça um orçamento e um limite de tempo. Decida quanto você pode perder sem que isso afete suas finanças ou sua vida diária. E o mais importante: cumpra esses limites, independentemente de ganhar ou perder.",
  },
  {
    title: "Não Corra Atrás de Prejuízos",
    content: "Após perdas, a tentação de apostar mais para recuperar o dinheiro perdido é comum, mas perigosa. Isso geralmente leva a perdas ainda maiores. Aceite as perdas como parte do jogo e evite essa armadilha.",
  },
  {
    title: "O Jogo Não Deve Interferir na Sua Vida",
    content: "Se as apostas estão começando a afetar seus relacionamentos, trabalho, estudos ou saúde mental, é um sinal de alerta. Priorize seu bem-estar e procure ajuda se sentir que o jogo está saindo do controle.",
  },
  {
    title: "Procure Ajuda se Precisar",
    content: "O vício em jogos de azar é uma condição séria. Se você ou alguém que você conhece está lutando contra o jogo compulsivo, existem recursos e profissionais que podem ajudar. Não hesite em procurar apoio.",
  },
];

const EducationalMessagesScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Mensagens Educativas: Jogo Responsável</Text>
      {educationalMessages.map((message, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.cardTitle}>{message.title}</Text>
          <Text style={styles.cardContent}>{message.content}</Text>
          {message.link && (
            <TouchableOpacity onPress={() => Linking.openURL(message.link)} style={styles.linkButton}>
              <Text style={styles.linkButtonText}>Saiba Mais</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 20,
    color: '#D4AF37',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  cardContent: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
  },
  linkButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  linkButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default EducationalMessagesScreen;
