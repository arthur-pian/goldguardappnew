import React, { createContext, useContext, useEffect, useState } from 'react';
import { loadUserData, saveUserData, clearUserData } from '../services/storageService';
import { View, Text, ActivityIndicator, StyleSheet, Alert } from 'react-native';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const data = await loadUserData();
        if (data && data.email) {
          setCurrentUser(data);
          setIsLoggedIn(true);
        } else {
          setCurrentUser(null);
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Erro ao carregar dados do usuário do AsyncStorage:", error);
        Alert.alert("Erro", "Não foi possível carregar os dados do usuário. Tente novamente.");
        setCurrentUser(null);
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  const login = async (userObject) => {
    try {
      await saveUserData(userObject);
      setCurrentUser(userObject);
      setIsLoggedIn(true);
      return true;
    } catch (error) {
      console.error("Erro durante o login no contexto:", error);
      Alert.alert("Erro", "Não foi possível finalizar o login. Tente novamente.");
      return false;
    }
  };

  const logout = async () => {
    try {
      await clearUserData();
      setCurrentUser(null);
      setIsLoggedIn(false);
    } catch (error) {
      console.error("Erro durante o logout:", error);
      Alert.alert("Erro", "Não foi possível realizar o logout.");
    }
  };

  const value = {
    currentUser,
    isLoggedIn,
    loading,
    login,
    logout,
  };

  if (loading) {
    return (
      <View style={authContextStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#D4AF37" />
        <Text style={authContextStyles.loadingText}>Carregando dados do aplicativo...</Text>
      </View>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

const authContextStyles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
});
