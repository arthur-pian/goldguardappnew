import AsyncStorage from '@react-native-async-storage/async-storage';
import { format, parseISO } from 'date-fns';

const USER_DATA_KEY = '@GoldGuard:currentUser';
const ALL_USERS_KEY = '@GoldGuard:allUsers';
const TRANSACTIONS_KEY_PREFIX = '@GoldGuard:transactions:';
const SALARY_KEY_PREFIX = '@GoldGuard:salary:';

/**
 * @returns {Promise<object | null>} 
 */
export const loadUserData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(USER_DATA_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error("Erro ao carregar dados do usuário:", e);
    return null;
  }
};

/**
 * @param {object} userData - Objeto com os dados do usuário (ex: { email: 'user@example.com', id: 'user@example.com' }).
 */
export const saveUserData = async (userData) => {
  try {
    const jsonValue = JSON.stringify(userData);
    await AsyncStorage.setItem(USER_DATA_KEY, jsonValue);
  } catch (e) {
    console.error("Erro ao salvar dados do usuário:", e);
  }
};


export const clearUserData = async () => {
  try {
    await AsyncStorage.removeItem(USER_DATA_KEY);
  } catch (e) {
    console.error("Erro ao limpar dados do usuário:", e);
  }
};

/**
 * @param {string} email
 * @param {string} password
 * @returns {Promise<boolean>} 
 */
export const registerUserLocal = async (email, password) => {
  try {
    const existingUsersJson = await AsyncStorage.getItem(ALL_USERS_KEY);
    const existingUsers = existingUsersJson ? JSON.parse(existingUsersJson) : [];

    if (existingUsers.some(user => user.email === email)) {
      return false; 
    }

    const newUser = { email, password };
    existingUsers.push(newUser);
    await AsyncStorage.setItem(ALL_USERS_KEY, JSON.stringify(existingUsers));
    await saveSalary(email, 0);
    await saveTransactions(email, []);

    return true;
  } catch (e) {
    console.error("Erro ao registrar usuário localmente:", e);
    return false;
  }
};

/**
 * @param {string} email
 * @param {string} password
 * @returns {Promise<object | null>}
 */
export const validateUserLogin = async (email, password) => {
  try {
    const usersJson = await AsyncStorage.getItem(ALL_USERS_KEY);
    const users = usersJson ? JSON.parse(usersJson) : [];
    const user = users.find(u => u.email === email && u.password === password);
    return user ? { email: user.email, id: user.email } : null; 
  } catch (e) {
    console.error("Erro ao validar login do usuário:", e);
    return null;
  }
};

/**
 * @param {string} userId 
 * @returns {Promise<number>} 
 */
export const loadSalary = async (userId) => {
  try {
    const salaryJson = await AsyncStorage.getItem(`${SALARY_KEY_PREFIX}${userId}`);
    return salaryJson != null ? parseFloat(salaryJson) : 0;
  } catch (e) {
    console.error("Erro ao carregar salário:", e);
    return 0;
  }
};

/**
 * @param {string} userId 
 * @param {number} salary 
 */
export const saveSalary = async (userId, salary) => {
  try {
    await AsyncStorage.setItem(`${SALARY_KEY_PREFIX}${userId}`, salary.toString());
  } catch (e) {
    console.error("Erro ao salvar salário:", e);
  }
};

/**
 * @param {string} userId 
 * @returns {Promise<Array<object>>} 
 */
export const loadTransactions = async (userId) => {
  try {
    const transactionsJson = await AsyncStorage.getItem(`${TRANSACTIONS_KEY_PREFIX}${userId}`);
    const transactions = transactionsJson ? JSON.parse(transactionsJson) : [];
    return transactions.map(t => ({
      ...t,
      timestamp: t.timestamp ? new Date(t.timestamp) : new Date(), 
    })).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()); 
  } catch (e) {
    console.error("Erro ao carregar transações:", e);
    return [];
  }
};

/**
 * @param {string} userId 
 * @param {Array<object>} transactions 
 */
export const saveTransactions = async (userId, transactions) => {
  try {

    const serializableTransactions = transactions.map(t => ({
      ...t,
      timestamp: t.timestamp ? t.timestamp.toISOString() : new Date().toISOString(),
    }));
    const jsonValue = JSON.stringify(serializableTransactions);
    await AsyncStorage.setItem(`${TRANSACTIONS_KEY_PREFIX}${userId}`, jsonValue);
  } catch (e) {
    console.error("Erro ao salvar transações:", e);
  }
};

/**
 * @param {string} userId 
 * @param {object} newTransactionData 
 */
export const addTransactionLocal = async (userId, newTransactionData) => {
  try {
    const currentTransactions = await loadTransactions(userId);
    const updatedTransactions = [...currentTransactions, {
      ...newTransactionData,
      id: Date.now().toString(), 
      timestamp: new Date(),
      amount: parseFloat(newTransactionData.amount), 
      monthYear: format(new Date(), 'yyyy-MM'),
      dayHour: format(new Date(), 'dd-HH'),
    }];
    await saveTransactions(userId, updatedTransactions);
  } catch (e) {
    console.error("Erro ao adicionar transação localmente:", e);
    throw e;
  }
};

/**
 *
 * @param {string} userId 
 * @param {string} monthYear 
 * @returns {Promise<Array<object>>} 
 */
export const getMonthlyDepositsLocal = async (userId, monthYear) => {
  try {
    const allTransactions = await loadTransactions(userId);
    return allTransactions.filter(t =>
      t.type === 'deposit' &&
      format(t.timestamp, 'yyyy-MM') === monthYear
    );
  } catch (e) {
    console.error("Erro ao buscar depósitos mensais localmente:", e);
    return [];
  }
};
