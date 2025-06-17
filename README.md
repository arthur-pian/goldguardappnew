# 👑 **GoldGuard**

## 👋 OI! BEM-VINDO AO GOLDGUARD! 👋

Bem-vindo ao **GoldGuard**, um aplicativo **React Native** desenvolvido para ajudar no gerenciamento de suas atividades de apostas esportivas.

Este projeto foca em um sistema de **autenticação local** e **armazenamento de dados interno** (baseado em JSON via `AsyncStorage`), além de oferecer uma **interface de navegação simplificada**.

---

## 🚀 **Funcionalidades**

- **Autenticação Local:** Permite o cadastro e login de usuários com dados armazenados diretamente no dispositivo.
- **Gestão de Transações:** Registre seus depósitos e saques, incluindo valor, casa de apostas, data e hora.
- **Controle de Salário:** Defina e acompanhe seu salário para visualizar o percentual gasto em apostas mensalmente.
- **Resumo Detalhado:** Acesse um panorama geral das suas operações, com totais, casas de apostas mais usadas e extrato mensal.
- **Mensagens Educativas:** Tenha acesso a conteúdos sobre jogo responsável para auxiliar no seu controle.
- **Navegação Simplificada:** Uma barra de navegação inferior manual facilita a alternância entre as telas principais do aplicativo.

---

## 💡 **Como Funciona (Visão Geral)**

O GoldGuard opera de forma **completamente local**, sem a necessidade de servidor backend.

- **Dados:** Armazenados com `AsyncStorage`, que funciona como um banco de dados interno baseado em JSON.
- **Autenticação:** Cadastro e login validados contra os dados salvos no dispositivo.
- **Navegação:** Uso do `React Navigation` com `Stack` e `Tabs` manuais, oferecendo flexibilidade e controle total.

---

## 👥 **Integrantes do Grupo**

- **Márcio Gastaldi - RM98811**
- **Arthur Bessa Pian - RM99215**
- **Davi Desenzi - RM550849**

---

## 🎨 **Figma do Projeto**

Visualize o design e o fluxo no Figma:

🔗 [Protótipo no Figma](https://www.figma.com/design/12Wc5Qe46gVZgkeWKmQThp/Untitled?node-id=0-1&t=8gtzwlV3mojDEMIf-1)

---

## ⚙️ **Requisitos para Rodar o Projeto**

- **Node.js:** Versão 18.x ou superior
- **npm:** Gerenciador de pacotes (vem com Node.js)
- **Expo CLI:** Instalar globalmente:
  ```bash
  npm install -g expo-cli
  ```
- **Expo Go:** Aplicativo no celular (Android/iOS) ou emulador/simulador instalado

---

## 🚀 **Instalação e Execução**

### 📁 Estrutura do Projeto

```
GoldGuardNovoApp/
├── assets/
├── context/
├── screens/
├── services/
├── .babelrc.js
├── App.js
├── app.json
├── package.json
├── package-lock.json
└── README.md
```
## 📦 **Dependências e Versões Usadas**

```json
{
  "name": "goldguardnovoapp",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo crash",
    "web": "expo start --web"
  },
  "dependencies": {
    "@react-native-async-storage/async-storage": "1.23.1",
    "@react-native-community/datetimepicker": "~8.0.0",
    "@react-navigation/native": "^6.1.17",
    "@react-navigation/native-stack": "^6.9.26",
    "date-fns": "^2.30.0",
    "expo": "~51.0.0",
    "expo-status-bar": "~1.12.1",
    "@expo/vector-icons": "~14.0.0",
    "react": "18.2.0",
    "react-native": "0.74.0",
    "react-native-safe-area-context": "4.10.1",
    "react-native-screens": "~3.31.1"
  },
  "devDependencies": {
    "@babel/core": "^7.20.0"
  },
  "private": true
}
```

---
