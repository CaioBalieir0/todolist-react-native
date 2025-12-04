# 📱 Todo List - React Native com Expo

Aplicativo mobile completo de gerenciamento de tarefas desenvolvido com **React Native** e **Expo**. O app oferece autenticação de usuários, CRUD de tarefas, filtros avançados e armazenamento local persistente com SQLite.

## 📋 Descrição do Projeto

Este é um aplicativo de trabalho final que implementa um sistema de gerenciamento de tarefas (To-Do List) com as seguintes características:

- **Autenticação**: Sistema de login e registro de usuários com validação de email e senha
- **Gerenciamento de Tarefas**: Criar, editar, deletar e marcar tarefas como concluídas
- **Filtros Inteligentes**: Filtrar tarefas por status (todas, concluídas, pendentes) e por título
- **Armazenamento Local**: Todas as tarefas e usuários são salvos localmente usando SQLite
- **Funciona Offline**: O aplicativo funciona completamente sem conexão com internet
- **Interface Responsiva**: Design limpo e intuitivo com feedback visual para o usuário

## 🎯 Funcionalidades Principais

### ✅ Autenticação

- Tela de **Login** com validação de email e senha
- Tela de **Registro** com validação completa (email válido, senhas coincidem, mínimo 6 caracteres)
- Contexto de autenticação (AuthContext) para gerenciar usuário logado
- Logout com confirmação

### ✅ Gerenciamento de Tarefas

- **Criar tarefas**: Campo para título (obrigatório) e descrição (opcional)
- **Editar tarefas**: Modificar título e descrição de tarefas existentes
- **Deletar tarefas**: Remover tarefas com modal de confirmação
- **Marcar como concluída**: Alternar status de tarefa com feedback visual
- **Pull-to-Refresh**: Atualizar lista de tarefas com gesto

### ✅ Filtros e Busca

- Filtrar por status: **Todas**, **Concluídas**, **Pendentes**
- Buscar por título: Campo de texto para filtro em tempo real
- Combinação de filtros: Status + Título simultaneamente

### ✅ Experiência do Usuário

- Notificações via Toast (sucesso, erro, aviso)
- Modais de confirmação para ações críticas
- Feedback visual para tarefas concluídas (texto riscado, opacidade reduzida)
- Layout responsivo e intuitivo

## 🛠️ Tecnologias Utilizadas

### 📦 Dependências Principais

| Tecnologia                     | Versão  | Descrição                                                       |
| ------------------------------ | ------- | --------------------------------------------------------------- |
| **React Native**               | 0.74.5  | Framework para desenvolvimento mobile multiplataforma           |
| **Expo**                       | ~51.0.0 | Plataforma para desenvolvimento e execução de apps React Native |
| **React Navigation**           | 6.x     | Navegação entre telas (Stack Navigator)                         |
| **expo-sqlite**                | ~14.0.2 | Banco de dados local SQLite                                     |
| **crypto-js**                  | ^4.2.0  | Criptografia para senhas (hash SHA-256)                         |
| **react-native-toast-message** | ^2.3.3  | Sistema de notificações (toast)                                 |

### 🔧 Ferramentas e Dependências de Suporte

- `@react-navigation/native` & `@react-navigation/stack` — Navegação
- `react-native-gesture-handler` — Gestos nativos
- `react-native-safe-area-context` — Área segura da tela
- `react-native-screens` — Otimização de navegação
- `react-native-web` — Suporte para web
- `@expo/metro-runtime` — Runtime do Expo

## 🚀 Como Executar o Projeto

### 📋 Pré-requisitos

Antes de começar, certifique-se de ter:

- **Node.js** (v14 ou superior) — [Download](https://nodejs.org/)
- **npm** ou **yarn** — gerenciador de pacotes
- **Expo CLI** (opcional): `npm install -g expo-cli`
- **Expo Go App** no seu dispositivo móvel ([iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))
- Emulador Android ou iOS (opcional)

### 📦 Instalação

1. **Clone ou acesse a pasta do projeto:**

   ```bash
   cd trabalho-final-marize
   ```

2. **Instale as dependências:**

   ```bash
   npm install
   ```

   (ou `yarn install`)

### ▶️ Executar o Aplicativo

3. **Inicie o servidor de desenvolvimento do Expo:**

   ```bash
   npm start
   ```

   ou

   ```bash
   expo start
   ```

   Você verá um QR code no terminal e as opções de execução.

4. **Abra no dispositivo ou emulador:**

   **Android:**

   - Pressione `a` no terminal
   - Ou escaneie o QR code com o **Expo Go**

   **iOS:**

   - Pressione `i` no terminal
   - Ou escaneie o QR code com a câmera do iPhone (abrirá no Expo Go)

   **Web:**

   - Pressione `w` no terminal
   - Abrirá automáticamente em `http://localhost:19006`

### 🔌 Scripts npm Disponíveis

```bash
npm start          # Inicia o servidor de desenvolvimento Expo
npm run android    # Inicia no emulador Android
npm run ios        # Inicia no emulador iOS
npm run web        # Inicia na versão web
```

## 📂 Estrutura do Projeto

```
trabalho-final-marize/
├── App.js                           # Ponto de entrada, configuração de navegação
├── app.json                         # Configuração do Expo
├── package.json                     # Dependências e scripts
├── README.md                        # Documentação (este arquivo)
│
├── src/
│   ├── screens/                     # Telas principais do aplicativo
│   │   ├── LoginScreen.js           # Tela de login
│   │   ├── RegisterScreen.js        # Tela de registro
│   │   ├── TodoListScreen.js        # Tela de listagem de tarefas
│   │   └── TodoFormScreen.js        # Tela de criação/edição de tarefas
│   │
│   ├── database/                    # Serviços de banco de dados
│   │   ├── database.js              # Inicialização e setup do SQLite
│   │   ├── taskService.js           # CRUD de tarefas
│   │   └── userService.js           # CRUD de usuários
│   │
│   ├── context/                     # Contexto React
│   │   └── AuthContext.js           # Gerenciamento de autenticação
│   │
│   ├── components/                  # Componentes reutilizáveis
│   │   ├── ConfirmModal.js          # Modal de confirmação
│   │   └── CustomPicker.js          # Picker customizado para filtros
│   │
│   ├── styles/                      # Estilos globais
│   │   └── globalStyles.js          # Stylesheet global da aplicação
│   │
│   └── utils/                       # Utilidades e helpers
│       ├── passwordHash.js          # Função de hash de senha
│       └── toast.js                 # Funções de notificação toast
```

## 📱 Telas do Aplicativo

### 🔐 1. **LoginScreen** — Tela de Login

**Arquivo:** `src/screens/LoginScreen.js`

- Campo de email com validação
- Campo de senha (oculto)
- Validação: email e senha não podem ser vazios
- Botão "Entrar" para fazer login
- Link "Não tem conta? Registre-se" para ir para RegisterScreen
- Toast de sucesso/erro
- Acesso ao banco de dados para validar usuário

**Fluxo:**

1. Usuário digita email e senha
2. Valida campos (não vazios)
3. Consulta banco de dados
4. Se válido: faz login e vai para TodoListScreen
5. Se inválido: exibe erro

---

### 📝 2. **RegisterScreen** — Tela de Registro

**Arquivo:** `src/screens/RegisterScreen.js`

- Campo de email com validação (deve ser email válido)
- Campo de senha (oculto)
- Campo de confirmação de senha
- Validações:
  - Email deve conter "@" e ponto (formato válido)
  - Senhas devem coincidir
  - Senha mínima de 6 caracteres
  - Todos os campos obrigatórios
- Botão "Registrar" para criar novo usuário
- Link "Já tem conta? Faça login" para voltar a LoginScreen
- Toast de sucesso/erro
- Hash de senha com SHA-256 antes de salvar

**Fluxo:**

1. Usuário preenche email, senha e confirmação
2. Valida todos os campos
3. Verifica se email já existe no banco
4. Se tudo OK: cria usuário com senha hasheada
5. Se sucesso: volta para LoginScreen
6. Se erro: exibe mensagem de erro

---

### 📋 3. **TodoListScreen** — Tela de Listagem de Tarefas

**Arquivo:** `src/screens/TodoListScreen.js`

**Funcionalidades:**

- Lista todas as tarefas do usuário logado
- **Filtros:**
  - Picker de status: "Todas", "Concluídas", "Pendentes"
  - Campo de busca: filtra por título em tempo real
- **Ações por tarefa:**
  - ✏️ **Editar**: Navega para TodoFormScreen
  - 🗑️ **Deletar**: Abre modal de confirmação
  - ✅ **Marcar/Desmarcar**: Alterna status done
- **Pull-to-Refresh**: Puxar para baixo para atualizar lista
- **Botão Flutuante "+"**: Navega para TodoFormScreen (criar nova)
- **Botão Logout**: Abre modal de confirmação para sair

**Feedback Visual:**

- Tarefas concluídas: texto com strike-through (riscado) e opacidade reduzida
- Tarefas pendentes: texto normal com destaque
- Toast em tempo real para ações

**Fluxo:**

1. Tela carrega tarefas do usuário
2. Exibe lista com filtros aplicados
3. Usuário pode filtrar, editar, deletar ou marcar como feito
4. Pull-to-refresh recarrega a lista
5. Botão logout confirma e faz logout

---

### ✍️ 4. **TodoFormScreen** — Tela de Criação/Edição de Tarefas

**Arquivo:** `src/screens/TodoFormScreen.js`

**Funcionalidades:**

- Campo "Título" (obrigatório)
- Campo "Descrição" (opcional)
- Validação: título não pode ser vazio
- Botão "Salvar Tarefa"
- Botão "Cancelar" para voltar

**Modos:**

1. **Criar nova tarefa**: Campos vazios, título na tela = "Nova Tarefa"
2. **Editar tarefa existente**: Recebe tarefa via params, título na tela = "Editar Tarefa"

**Fluxo (Criar):**

1. Usuário clica no botão "+" na TodoListScreen
2. Abre TodoFormScreen em modo criação
3. Preenche título (obrigatório) e descrição (opcional)
4. Clica "Salvar"
5. Se OK: cria tarefa, exibe toast e volta para TodoListScreen
6. Se erro: exibe mensagem de erro

**Fluxo (Editar):**

1. Usuário clica botão "Editar" em uma tarefa
2. Abre TodoFormScreen com dados preenchidos
3. Modifica título e/ou descrição
4. Clica "Salvar"
5. Se OK: atualiza tarefa, exibe toast e volta para TodoListScreen
6. Se erro: exibe mensagem de erro

---

## 🗄️ Banco de Dados (SQLite)

### Tabela `users`

```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL
)
```

### Tabela `tasks`

```sql
CREATE TABLE tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  done INTEGER DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
)
```

**Campos:**

- `id`: identificador único da tarefa
- `user_id`: ID do usuário proprietário da tarefa
- `title`: título da tarefa (obrigatório)
- `description`: descrição opcional
- `done`: 0 = pendente, 1 = concluída

---

## 🎨 Design e Interface

### Paleta de Cores

- **Primária**: Azul (#007AFF)
- **Sucesso**: Verde (#34C759)
- **Erro**: Vermelho (#FF3B30)
- **Fundo**: Branco (#FFFFFF)
- **Texto**: Preto (#000000)
- **Placeholder**: Cinza (#C0C0C0)

### Componentes Customizados

#### 📦 **CustomPicker**

Componente para seleção de filtros de status

- Opções: "Todas", "Concluídas", "Pendentes"
- Usa React Native Picker nativo

#### 🔔 **ConfirmModal**

Modal de confirmação para ações críticas

- Logout
- Deletar tarefa
- Customizável com título, mensagem e callbacks

---

## 🔐 Segurança

- **Senhas**: Hasheadas com SHA-256 usando `crypto-js`
- **Validação**: Validação rigorosa de email (regex)
- **Armazenamento**: Dados salvos localmente no SQLite, sem servidor
- **Contexto**: Autenticação gerenciada via AuthContext

---

## 📝 Notas de Desenvolvimento

- O banco de dados SQLite é criado automaticamente na primeira execução
- Todas as operações assíncronas possuem tratamento de erro
- A lista de tarefas é atualizada automaticamente após operações CRUD
- Cada usuário vê apenas suas próprias tarefas
- O aplicativo não requer conexão com internet
- Senhas são sempre hasheadas antes de armazenar no banco

---

## 🚀 Próximas Melhorias (Sugestões Futuras)

- [ ] Sincronização com backend (Firebase, API REST)
- [ ] Notificações locais para lembretes de tarefas
- [ ] Temas (Light/Dark Mode)
- [ ] Categorias/Tags para tarefas
- [ ] Prioridades de tarefas
- [ ] Data de vencimento (due date)
- [ ] Testes unitários e de integração
- [ ] Autenticação com biometria (Face ID, Touch ID)
- [ ] Sincronização em nuvem para backup

---

## 📄 Licença

Projeto desenvolvido como **trabalho final**. Sinta-se à vontade para estudar, modificar e usar como referência para aprendizado.

---

## 👨‍💻 Desenvolvido com

- ❤️ React Native
- 🚀 Expo
- 💾 SQLite
- 🎯 React Navigation

**Desenvolvido em: dezembro de 2025**
