# Todo List - React Native com Expo

Aplicativo completo de gerenciamento de tarefas (Todo List) desenvolvido em React Native utilizando Expo, com funcionalidades de CRUD completo e armazenamento local usando SQLite.

## 📱 Funcionalidades

- **Autenticação**: Tela de login com validação local
- **Listagem de Tarefas**: Visualização de todas as tarefas em uma lista
- **Criação de Tarefas**: Adicionar novas tarefas com título e descrição
- **Edição de Tarefas**: Modificar tarefas existentes
- **Exclusão de Tarefas**: Remover tarefas com confirmação
- **Marcar como Concluída**: Alternar status de pendente/concluído
- **Armazenamento Local**: Todas as tarefas são salvas localmente usando SQLite

## 🛠️ Tecnologias Utilizadas

- **React Native**: Framework para desenvolvimento mobile
- **Expo**: Plataforma e ferramentas para desenvolvimento React Native
- **SQLite**: Banco de dados local (expo-sqlite)
- **React Navigation**: Navegação entre telas (@react-navigation/native e @react-navigation/stack)

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- Node.js (versão 14 ou superior)
- npm ou yarn
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app no seu dispositivo móvel (iOS ou Android) ou um emulador

## 🚀 Como Executar o Projeto

1. **Clone o repositório ou navegue até a pasta do projeto**

```bash
cd "trabalho final"
```

2. **Instale as dependências**

```bash
npm install
```

3. **Inicie o servidor Expo**

```bash
npm start
# ou
expo start
```

4. **Execute no dispositivo**

   - **Android**: Pressione `a` no terminal ou escaneie o QR code com o Expo Go
   - **iOS**: Pressione `i` no terminal ou escaneie o QR code com a câmera do iPhone
   - **Web**: Pressione `w` no terminal

## 📂 Estrutura do Projeto

```
/
├── App.js                 # Ponto de entrada e configuração de navegação
├── package.json           # Dependências do projeto
├── app.json              # Configuração do Expo
├── README.md             # Documentação do projeto
└── src/
    ├── screens/
    │   ├── LoginScreen.js        # Tela de login
    │   ├── TodoListScreen.js     # Tela de listagem de tarefas
    │   └── TodoFormScreen.js     # Tela de criação/edição de tarefas
    ├── database/
    │   ├── database.js           # Configuração e inicialização do SQLite
    │   └── taskService.js        # Serviços CRUD para tarefas
    ├── components/               # Componentes reutilizáveis (se houver)
    └── styles/
        └── globalStyles.js       # Estilos globais da aplicação
```

## 🗄️ Banco de Dados

O aplicativo utiliza SQLite local para armazenar as tarefas. A tabela `tasks` possui os seguintes campos:

- `id`: INTEGER PRIMARY KEY AUTOINCREMENT
- `title`: TEXT NOT NULL (título da tarefa)
- `description`: TEXT (descrição opcional)
- `done`: INTEGER DEFAULT 0 (0 = pendente, 1 = concluída)

## 📱 Telas do Aplicativo

### 1. LoginScreen

- Validação local de email e senha (qualquer valor não vazio)
- Após login bem-sucedido, navega para a lista de tarefas
- Botão de voltar desabilitado após login

### 2. TodoListScreen

- Lista todas as tarefas do banco de dados
- Cada item mostra: título, descrição e status
- Botões de ação: Editar, Excluir (com confirmação), Marcar como Concluída
- Botão flutuante "+" para adicionar nova tarefa
- Pull-to-refresh para atualizar a lista
- Feedback visual para tarefas concluídas (texto riscado e cor mais clara)

### 3. TodoFormScreen

- Formulário para criar ou editar tarefas
- Campos: título (obrigatório) e descrição (opcional)
- Validação de campos obrigatórios
- Botão Salvar que cria ou atualiza a tarefa

## 🎨 Interface

- Design limpo e moderno
- Feedback visual para ações do usuário
- Alerts para confirmações e validações
- Layout responsivo
- Tarefas concluídas aparecem com texto riscado e opacidade reduzida

## 📸 Capturas de Tela

_(Adicione capturas de tela do aplicativo aqui)_

## 🔧 Scripts Disponíveis

- `npm start`: Inicia o servidor de desenvolvimento Expo
- `npm run android`: Inicia no Android
- `npm run ios`: Inicia no iOS
- `npm run web`: Inicia na web

## 📝 Notas de Desenvolvimento

- O banco de dados SQLite é criado automaticamente na primeira execução
- Todas as operações de banco de dados são assíncronas e tratam erros adequadamente
- A lista de tarefas é atualizada automaticamente após operações CRUD
- O aplicativo não requer conexão com internet para funcionar

## 📄 Licença

Este projeto foi desenvolvido como trabalho final.

---

Desenvolvido com ❤️ usando React Native e Expo
# trabalho-final-marize
