import { Platform } from 'react-native';

let db = null;
let SQLite = null;

// Detecta se está na web de forma mais robusta
const isWeb =
  Platform.OS === 'web' ||
  (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined');

// Importa SQLite dinamicamente apenas para mobile
if (!isWeb) {
  try {
    SQLite = require('expo-sqlite');
    console.log('✅ expo-sqlite importado com sucesso');
  } catch (error) {
    console.error('❌ Erro ao importar expo-sqlite:', error);
  }
}

// Abre ou cria o banco de dados (apenas para mobile)
const initializeDatabase = () => {
  if (isWeb) {
    return null;
  }

  if (!SQLite) {
    console.error('❌ SQLite não foi importado');
    return null;
  }

  try {
    console.log('🔧 Inicializando SQLite...');
    console.log('SQLite objeto:', SQLite);
    console.log('SQLite tipo:', typeof SQLite);
    console.log('SQLite keys:', SQLite ? Object.keys(SQLite) : 'null');

    // Tenta diferentes formas de acessar openDatabase
    let openDatabaseFunc = null;

    if (SQLite.openDatabase && typeof SQLite.openDatabase === 'function') {
      openDatabaseFunc = SQLite.openDatabase;
      console.log('✅ Encontrou SQLite.openDatabase');
    } else if (SQLite.default && SQLite.default.openDatabase) {
      openDatabaseFunc = SQLite.default.openDatabase;
      console.log('✅ Encontrou SQLite.default.openDatabase');
    } else if (typeof SQLite === 'function') {
      openDatabaseFunc = SQLite;
      console.log('✅ SQLite é uma função direta');
    }

    if (openDatabaseFunc) {
      db = openDatabaseFunc('todo.db');
      console.log('✅ Banco SQLite aberto com sucesso');
      return db;
    } else {
      console.error('❌ Não foi possível encontrar openDatabase');
      console.error('SQLite completo:', JSON.stringify(SQLite, null, 2));
      return null;
    }
  } catch (error) {
    console.error('❌ Erro ao abrir banco SQLite:', error);
    console.error('Stack:', error.stack);
    return null;
  }
};

// Inicializa o banco quando o módulo é carregado (apenas para mobile)
if (!isWeb) {
  // Aguarda um pouco para garantir que o módulo está totalmente carregado
  setTimeout(() => {
    db = initializeDatabase();
  }, 200);
}

// Inicializa o banco de dados criando a tabela se não existir
export const initDatabase = () => {
  return new Promise((resolve, reject) => {
    if (isWeb) {
      // Na web, inicializa o localStorage
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          // Inicializa arrays vazios se não existirem
          if (!localStorage.getItem('tasks')) {
            localStorage.setItem('tasks', JSON.stringify([]));
          }
          if (!localStorage.getItem('users')) {
            localStorage.setItem('users', JSON.stringify([]));
          }

          // Migração: adiciona idUser às tarefas antigas que não têm (opcional)
          const tasksJson = localStorage.getItem('tasks');
          if (tasksJson) {
            const tasks = JSON.parse(tasksJson);
            let needsUpdate = false;
            const updatedTasks = tasks.map((task) => {
              if (!task.idUser) {
                needsUpdate = true;
                // Tarefas antigas sem idUser serão removidas ou podem ser atribuídas a um usuário padrão
                // Por segurança, vamos apenas marcar que precisa atualizar
                return { ...task, idUser: null };
              }
              return task;
            });
            // Remove tarefas sem idUser (tarefas antigas)
            const validTasks = updatedTasks.filter(
              (task) => task.idUser !== null
            );
            if (needsUpdate && validTasks.length !== tasks.length) {
              localStorage.setItem('tasks', JSON.stringify(validTasks));
              console.log(
                'Migração: tarefas antigas sem idUser foram removidas'
              );
            }
          }
          console.log('Banco de dados (localStorage) inicializado na web');
          resolve();
        } else {
          console.warn('localStorage não disponível, usando memória');
          resolve();
        }
      } catch (error) {
        console.error('Erro ao inicializar localStorage:', error);
        resolve(); // Resolve mesmo com erro para não bloquear
      }
      return;
    }

    // Função para criar as tabelas
    const createTables = () => {
      if (!db) {
        console.error('❌ db não está disponível para criar tabelas');
        reject(new Error('Banco de dados não disponível'));
        return;
      }

      console.log('📋 Criando tabelas no banco de dados...');
      db.transaction(
        (tx) => {
          // Cria tabela de usuários
          tx.executeSql(
            `CREATE TABLE IF NOT EXISTS users (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              email TEXT NOT NULL UNIQUE,
              password TEXT NOT NULL
            );`,
            [],
            () => {
              console.log('✅ Tabela users criada com sucesso');
            },
            (_, error) => {
              console.error('❌ Erro ao criar tabela users:', error);
            }
          );

          // Cria tabela de tarefas
          tx.executeSql(
            `CREATE TABLE IF NOT EXISTS tasks (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              title TEXT NOT NULL,
              description TEXT,
              done INTEGER DEFAULT 0,
              idUser INTEGER NOT NULL,
              FOREIGN KEY (idUser) REFERENCES users(id)
            );`,
            [],
            () => {
              console.log('✅ Tabela tasks criada com sucesso');
              resolve();
            },
            (_, error) => {
              console.error('❌ Erro ao criar tabela tasks:', error);
              reject(error);
            }
          );
        },
        (error) => {
          console.error('❌ Erro na transação:', error);
          reject(error);
        },
        () => {
          console.log('✅ Transação concluída com sucesso');
        }
      );
    };

    // Se db ainda não foi inicializado, tenta inicializar
    if (!db) {
      console.log('🔄 db não inicializado, tentando inicializar...');
      const newDb = initializeDatabase();
      if (newDb) {
        db = newDb;
        // Aguarda um pouco antes de criar as tabelas
        setTimeout(() => {
          createTables();
        }, 100);
      } else {
        reject(new Error('Banco de dados não disponível'));
      }
      return;
    }

    // Se db já está inicializado, cria as tabelas
    createTables();
  });
};

export default db;
