GoldGuard: Gerenciador de Apostas Esportivas (Local)
👋 OI! BEM-VINDO AO GOLDGUARD! 👋
Bem-vindo ao GoldGuard, um aplicativo React Native desenvolvido para ajudar no gerenciamento de suas atividades de apostas esportivas. Este projeto foca em um sistema de autenticação local e armazenamento de dados interno (baseado em JSON via AsyncStorage), além de oferecer uma interface de navegação simplificada.

🚀 Funcionalidades Principais
Autenticação Local: Sistema de login e cadastro de usuários sem a necessidade de um backend externo (Firebase, etc.). Os dados do usuário (email e senha) são armazenados localmente.

Gestão de Transações: Registre depósitos e saques, especificando valores, casas de apostas e datas/horas.

Controle de Salário: Defina e acompanhe seu salário mensal para calcular o percentual gasto em apostas.

Resumo Detalhado: Visualize um resumo geral de depósitos e saques, as casas de apostas mais utilizadas e um extrato de todas as suas operações.

Mensagens Educativas: Aceda a dicas e mensagens sobre jogo responsável.

Navegação por Abas Manual: Uma barra de navegação inferior implementada manualmente para alternar entre as telas principais (Resumo, Operações, Educação), garantindo compatibilidade.

💡 Como Funciona (Arquitetura Simplificada)
O GoldGuard utiliza uma arquitetura cliente-side para gerenciamento de dados:

Autenticação: As contas de usuário (email e senha) são criadas e validadas localmente. Todos os usuários são armazenados no AsyncStorage do dispositivo.

Banco de Dados Interno (JSON): Dados sensíveis como transações e salário de cada usuário são armazenados no AsyncStorage do dispositivo, serializados como strings JSON. O storageService.js abstrai essa interação, simulando um banco de dados interno.

Gestão de Estado: O AuthContext.js gerencia o estado de autenticação do usuário (se está logado ou não) e o objeto do usuário atual, disponibilizando-o para toda a aplicação.

Navegação: O React Navigation é utilizado para a navegação principal (pilha de login/cadastro e a tela principal). A barra de navegação inferior é construída manualmente, usando o estado do React para alternar entre as telas, o que evita os problemas de compatibilidade de peer dependencies com bibliotecas de navegação por abas mais complexas.

⚙️ Requisitos para Rodar o Projeto
Para executar este projeto no seu ambiente de desenvolvimento, você precisará ter instalado:

Node.js: Versão 18.x ou superior.

npm: Gerenciador de pacotes do Node.js (geralmente vem com o Node.js).

Expo CLI: Ferramenta de linha de comando do Expo. Instale globalmente:

npm install -g expo-cli

Expo Go: Aplicativo no seu smartphone (Android ou iOS) ou um emulador/simulador configurado.

🚀 Instalação e Execução (Passo a Passo DETALHADO)
Siga estas instruções com máxima atenção e na ordem exata para garantir que o projeto seja configurado e executado corretamente:

Feche ABSOLUTAMENTE TUDO:

Feche todos os terminais abertos.

Feche qualquer instância do Expo Go (emulador, simulador, ou no seu telefone).

Feche o seu editor de código (VS Code, etc.).

Crie um NOVO Diretório para o Projeto:

Abra um novo terminal e navegue até o diretório onde deseja armazenar seus projetos (ex: C:\Users\arthur\Desktop\projetos).

cd C:\Users\arthur\Desktop\projetos

Crie um NOVO e único nome para a pasta do seu projeto. É fundamental que este nome seja diferente de qualquer projeto GoldGuard anterior para evitar conflitos de cache.

npx create-expo-app GoldGuardNovoApp --template blank

Substitua GoldGuardNovoApp pelo nome que desejar, mas certifique-se de que é novo.

Navegue para a Nova Pasta do Projeto:

cd GoldGuardNovoApp

Substitua o package.json Gerado (CRÍTICO!):

Abra o arquivo package.json que foi criado dentro da pasta GoldGuardNovoApp.

Copie TODO o conteúdo do package.json fornecido abaixo (na seção "Dependências e Versões Exatas") e COLE-O, SUBSTITUINDO COMPLETAMENTE TODO O CONTEÚDO ORIGINAL do seu package.json local.

SALVE o arquivo imediatamente após colar.

Limpeza Profunda e Instalação das Dependências (ESSENCIAL para evitar erros):
No terminal (ainda dentro da pasta GoldGuardNovoApp), execute estes comandos NA ORDEM EXATA. Confirme que cada comando é concluído antes de iniciar o próximo:

# 1. Limpar o cache do Expo (reinicia o cache do Metro Bundler)
npx expo start -c

# 2. Limpar o cache global do npm (remove pacotes corrompidos do cache do npm)
npm cache clean --force

# 3. Remover a pasta 'node_modules' (apaga todas as bibliotecas instaladas)
#    Para Windows:
rmdir /s /q node_modules
#    Para macOS/Linux:
#    rm -rf node_modules

# 4. Remover o arquivo 'package-lock.json' (força o npm a resolver as dependências do zero)
#    Para Windows:
del package-lock.json
#    Para macOS/Linux:
#    rm package-lock.json

# 5. Instalar TODAS as dependências do zero com base no seu NOVO package.json
npm install

Se, e somente se, o npm install falhar com ERESOLVE novamente, tente npm install --force. Esta é a última alternativa para forçar a instalação.

Crie as Pastas de Código:
Dentro da pasta GoldGuardNovoApp, crie as seguintes subpastas (se ainda não existirem):

context

services

screens

assets (Esta pasta deve ser criada por padrão pelo Expo.)

Copie os Demais Arquivos de Código:
Copie e cole o código de App.js, AuthContext.js, storageService.js, LoginScreen.js, RegisterScreen.js, SummaryScreen.js, OperationsScreen.js e EducationalMessagesScreen.js (fornecidos nas mensagens anteriores) para as suas respectivas pastas e arquivos neste novo projeto. Certifique-se de substituir o conteúdo completo de cada arquivo.

Inicie o Servidor de Desenvolvimento Expo:
No terminal (ainda dentro da pasta GoldGuardNovoApp):

npx expo start

Abra o Aplicativo no Seu Celular/Emulador:

Abra o aplicativo Expo Go no seu smartphone.

Escaneie o QR code exibido no seu terminal ou na página web do Metro Bundler.

O aplicativo GoldGuard será carregado no seu dispositivo.

📦 Dependências e Versões Exatas
Este é o package.json que deve ser usado, com as versões precisas e compatíveis das bibliotecas:

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

📂 Estrutura de Pastas
GoldGuardNovoApp/
├── assets/                  # Imagens e ícones do projeto
├── context/                 # Contextos React (ex: AuthContext)
├── screens/                 # Componentes de tela do aplicativo
├── services/                # Serviços de dados (ex: storageService.js)
├── .babelrc.js              # Configuração do Babel
├── App.js                   # Componente principal do aplicativo (navegação, etc.)
├── app.json                 # Configuração do Expo
├── package.json             # Lista de dependências e scripts do projeto
├── package-lock.json        # Gerado pelo npm, detalha as versões exatas instaladas
└── README.md                # Este arquivo!

⚠️ Notas Importantes e Resolução de Problemas
A ordem e a precisão dos comandos de limpeza e instalação são a chave para resolver os problemas de dependência.

Se o npm install ainda apresentar erros ERESOLVE, mesmo após a limpeza rigorosa, tente npm install --force. Esta opção força a instalação ignorando conflitos de peer dependency. Use-a como último recurso.

Problemas persistentes após todas as tentativas podem indicar um ambiente Node.js/npm corrompido em seu sistema, o que pode exigir uma reinstalação completa do Node.js e do npm.

Esperamos que estas instruções detalhadas permitam que você configure e execute o GoldGuard com sucesso!
