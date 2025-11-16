import db, { initDatabase } from './database';
import { Platform } from 'react-native';

// Detecta se está na web de forma mais robusta
const isWeb =
  Platform.OS === 'web' ||
  (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined');

// Inicializa o banco quando o serviço é importado
// Na web, garante que o localStorage está disponível
if (isWeb && typeof window !== 'undefined') {
  // Aguarda um pouco para garantir que o DOM está pronto
  if (window.localStorage) {
    initDatabase().catch((err) => {
      console.error('Erro ao inicializar banco na web:', err);
    });
  } else {
    // Tenta novamente após um delay
    setTimeout(() => {
      initDatabase().catch((err) => {
        console.error('Erro ao inicializar banco na web (retry):', err);
      });
    }, 100);
  }
} else {
  initDatabase().catch((err) => {
    console.error('Erro ao inicializar banco:', err);
  });
}

// Cria um novo usuário
export const createUser = (email, password) => {
  return new Promise((resolve, reject) => {
    // Verifica novamente dentro da função para garantir
    const isWebCheck =
      Platform.OS === 'web' ||
      (typeof window !== 'undefined' &&
        typeof window.localStorage !== 'undefined');
    console.log(
      'createUser chamado - isWeb:',
      isWeb,
      'isWebCheck:',
      isWebCheck,
      'Platform.OS:',
      Platform.OS,
      'email:',
      email
    );
    console.log(
      'window disponível:',
      typeof window !== 'undefined',
      'localStorage disponível:',
      typeof window !== 'undefined' &&
        typeof window.localStorage !== 'undefined'
    );

    if (isWeb || isWebCheck) {
      try {
        // Garante que o localStorage está inicializado
        if (typeof window === 'undefined' || !window.localStorage) {
          console.error('localStorage não disponível');
          reject(new Error('localStorage não disponível'));
          return;
        }

        console.log('Acessando localStorage...');
        const usersJson = localStorage.getItem('users');
        console.log('usersJson do localStorage:', usersJson);
        const users = usersJson ? JSON.parse(usersJson) : [];
        console.log('Usuários existentes:', users.length);

        // Verifica se o email já existe
        const existingUser = users.find((u) => u.email === email);
        if (existingUser) {
          console.log('Email já cadastrado:', email);
          reject(new Error('Email já cadastrado'));
          return;
        }

        const newId =
          users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;
        const newUser = {
          id: newId,
          email,
          password, // Em produção, isso deveria ser criptografado
        };
        console.log('Novo usuário a ser criado:', newUser);
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        console.log(
          'Usuário salvo no localStorage. Total de usuários:',
          users.length
        );
        console.log(
          'Verificando localStorage após salvar:',
          localStorage.getItem('users')
        );
        resolve(newId);
      } catch (error) {
        console.error('Erro ao criar usuário:', error);
        reject(error);
      }
      return;
    }

    if (!db) {
      reject(new Error('Banco de dados não disponível'));
      return;
    }

    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO users (email, password) VALUES (?, ?);',
        [email, password], // Em produção, senha deveria ser criptografada
        (_, { insertId }) => {
          resolve(insertId);
        },
        (_, error) => {
          if (error.message && error.message.includes('UNIQUE')) {
            reject(new Error('Email já cadastrado'));
          } else {
            console.error('Erro ao criar usuário:', error);
            reject(error);
          }
        }
      );
    });
  });
};

// Verifica credenciais de login
export const loginUser = (email, password) => {
  return new Promise((resolve, reject) => {
    if (isWeb) {
      try {
        // Garante que o localStorage está disponível
        if (typeof window === 'undefined' || !window.localStorage) {
          reject(new Error('localStorage não disponível'));
          return;
        }

        const usersJson = localStorage.getItem('users');
        const users = usersJson ? JSON.parse(usersJson) : [];

        console.log('Tentando fazer login com:', email);
        console.log('Usuários cadastrados:', users.length);

        const user = users.find(
          (u) => u.email === email && u.password === password
        );

        if (user) {
          console.log('Login bem-sucedido para:', email);
          resolve(user);
        } else {
          console.log(
            'Login falhou - usuário não encontrado ou senha incorreta'
          );
          reject(new Error('Email ou senha inválidos'));
        }
      } catch (error) {
        console.error('Erro ao fazer login:', error);
        reject(error);
      }
      return;
    }

    if (!db) {
      reject(new Error('Banco de dados não disponível'));
      return;
    }

    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM users WHERE email = ? AND password = ?;',
        [email, password],
        (_, { rows }) => {
          if (rows.length > 0) {
            const user = {
              id: rows.item(0).id,
              email: rows.item(0).email,
            };
            resolve(user);
          } else {
            reject(new Error('Email ou senha inválidos'));
          }
        },
        (_, error) => {
          console.error('Erro ao fazer login:', error);
          reject(error);
        }
      );
    });
  });
};
