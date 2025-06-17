import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, useAuth } from './context/AuthContext';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';

import { MaterialCommunityIcons } from '@expo/vector-icons';

// Telas de Autenticação
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';

// Telas Principais do App
import SummaryScreen from './screens/SummaryScreen';
import OperationsScreen from './screens/OperationsScreen';
import EducationalMessagesScreen from './screens/EducationalMessagesScreen';

const Stack = createNativeStackNavigator();
const MainScreenWithTabs = () => {
  const [activeTab, setActiveTab] = useState('Summary'); 

  const renderScreen = () => {
    switch (activeTab) {
      case 'Summary':
        return <SummaryScreen />;
      case 'Operations':
        return <OperationsScreen />;
      case 'EducationalMessages':
        return <EducationalMessagesScreen />;
      default:
        return <SummaryScreen />;
    }
  };

  return (
    <View style={styles.mainScreenContainer}>
      <View style={styles.contentContainer}>
        {renderScreen()}
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setActiveTab('Summary')}
        >
          <MaterialCommunityIcons
            name="file-chart"
            size={24}
            color={activeTab === 'Summary' ? '#D4AF37' : 'gray'}
          />
          <Text style={[styles.tabText, activeTab === 'Summary' && styles.tabTextActive]}>Resumo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setActiveTab('Operations')}
        >
          <MaterialCommunityIcons
            name="calculator" 
            size={24}
            color={activeTab === 'Operations' ? '#D4AF37' : 'gray'}
          />
          <Text style={[styles.tabText, activeTab === 'Operations' && styles.tabTextActive]}>Operações</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setActiveTab('EducationalMessages')}
        >
          <MaterialCommunityIcons
            name="lightbulb-on" 
            size={24}
            color={activeTab === 'EducationalMessages' ? '#D4AF37' : 'gray'}
          />
          <Text style={[styles.tabText, activeTab === 'EducationalMessages' && styles.tabTextActive]}>Educação</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const AppNavigator = () => {
  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#D4AF37" />
        <Text style={styles.loadingText}>Verificando autenticação...</Text>
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{
      headerStyle: { backgroundColor: '#D4AF37' },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold' },
      headerShown: false 
    }}>
      {isLoggedIn ? (

        <Stack.Screen name="MainTabs" component={MainScreenWithTabs} />
      ) : (

        <>
          <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Cadastro' }} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
      <StatusBar style="auto" />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
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
  mainScreenContainer: {
    flex: 1,
  },
  contentContainer: {
    flex: 1, 
  },
  tabBar: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 5, 
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 12,
    color: 'gray',
    marginTop: 2,
  },
  tabTextActive: {
    color: '#D4AF37', 
    fontWeight: 'bold',
  },
});
