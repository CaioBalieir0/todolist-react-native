import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';

let db = null;
// Detecta se está na web de forma mais robusta
const isWeb =
  Platform.OS === 'web' ||
  (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined');

// Abre ou cria o banco de dados (apenas para mobile)
if (!isWeb) {
  try {
    db = SQLite.openDatabase('todo.db');
  } catch (error) {
    console.error('Erro ao abrir banco SQLite:', error);
  }
}

// Inicializa o banco de dados criando a tabela se não existir
export const initDatabase = () => {
  return new Promise((resolve, reject) => {
    if (isWeb) {
      // Na web, inicializa o localStorage
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          if (!localStorage.getItem('tasks')) {
            localStorage.setItem('tasks', JSON.stringify([]));
          }
          if (!localStorage.getItem('users')) {
            localStorage.setItem('users', JSON.stringify([]));
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

    if (!db) {
      reject(new Error('Banco de dados não disponível'));
      return;
    }

    db.transaction((tx) => {
      // Cria tabela de usuários
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT NOT NULL UNIQUE,
          password TEXT NOT NULL
        );`,
        [],
        () => {
          console.log('Tabela users criada com sucesso');
        },
        (_, error) => {
          console.error('Erro ao criar tabela users:', error);
        }
      );

      // Cria tabela de tarefas
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS tasks (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          description TEXT,
          done INTEGER DEFAULT 0
        );`,
        [],
        () => {
          console.log('Tabela tasks criada com sucesso');
          resolve();
        },
        (_, error) => {
          console.error('Erro ao criar tabela tasks:', error);
          reject(error);
        }
      );
    });
  });
};

export default db;
