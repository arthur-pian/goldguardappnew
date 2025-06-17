import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { registerUserLocal } from '../services/storageService';

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("Erro de Cadastro", "Por favor, preencha todos os campos.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Erro de Cadastro", "As senhas não coincidem!");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Erro de Cadastro", "A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    try {
      const success = await registerUserLocal(email, password);
      if (success) {
        Alert.alert("Sucesso", "Usuário cadastrado com sucesso! Faça login.");
        navigation.navigate('Login');
      } else {
        Alert.alert("Erro de Cadastro", "Este email já está em uso.");
      }
    } catch (error) {
      console.error("Erro inesperado no cadastro:", error);
      Alert.alert("Erro de Cadastro", "Ocorreu um erro ao tentar cadastrar. Tente novamente.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastre-se no GoldGuard</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirmar Senha"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Registrar</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.linkText}>Já tem conta? Entrar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#D4AF37',
  },
  input: {
    width: '90%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  button: {
    width: '90%',
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#D4AF37',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  linkText: {
    color: '#555',
    marginTop: 10,
  },
});

export default RegisterScreen;
