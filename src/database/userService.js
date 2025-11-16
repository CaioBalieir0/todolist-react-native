import db, { initDatabase } from './database';
import { Platform } from 'react-native';
import { hashPassword, comparePassword } from '../utils/passwordHash';

// Detecta se está na web de forma mais robusta
const isWeb =
  Platform.OS === 'web' ||
  (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined');

// Inicializa o banco quando o serviço é importado
initDatabase().catch((err) => {
  console.error('Erro ao inicializar banco:', err);
});

// Cria um novo usuário
export const createUser = (email, password) => {
  return new Promise((resolve, reject) => {
    if (isWeb) {
      try {
        if (typeof window === 'undefined' || !window.localStorage) {
          reject(new Error('localStorage não disponível'));
          return;
        }

        const usersJson = localStorage.getItem('users');
        const users = usersJson ? JSON.parse(usersJson) : [];

        // Verifica se o email já existe
        const existingUser = users.find((u) => u.email === email);
        if (existingUser) {
          reject(new Error('Email já cadastrado'));
          return;
        }

        const newId =
          users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;

        // Gera hash da senha antes de salvar
        const passwordHash = hashPassword(password);

        const newUser = {
          id: newId,
          email,
          password: passwordHash, // Senha com hash
        };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        console.log('Usuário criado com sucesso:', email);
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
      // Gera hash da senha antes de salvar
      const passwordHash = hashPassword(password);

      tx.executeSql(
        'INSERT INTO users (email, password) VALUES (?, ?);',
        [email, passwordHash], // Senha com hash
        (_, { insertId }) => {
          resolve(insertId);
        },
        (_, error) => {
          console.error('Erro ao criar usuário:', error);
          reject(error);
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
        if (typeof window === 'undefined' || !window.localStorage) {
          reject(new Error('localStorage não disponível'));
          return;
        }

        const usersJson = localStorage.getItem('users');
        const users = usersJson ? JSON.parse(usersJson) : [];

        // Busca o usuário pelo email
        const user = users.find((u) => u.email === email);

        if (user) {
          // Compara a senha fornecida com o hash armazenado
          const passwordMatches = comparePassword(password, user.password);

          if (passwordMatches) {
            console.log('Login bem-sucedido para:', email);
            // Retorna o usuário sem a senha
            const { password: _, ...userWithoutPassword } = user;
            resolve(userWithoutPassword);
          } else {
            console.log('Login falhou - senha incorreta');
            reject(new Error('Email ou senha inválidos'));
          }
        } else {
          console.log('Login falhou - usuário não encontrado');
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
      // Busca o usuário apenas pelo email
      tx.executeSql(
        'SELECT * FROM users WHERE email = ?;',
        [email],
        (_, { rows }) => {
          if (rows.length > 0) {
            const user = rows.item(0);
            const storedPasswordHash = user.password;

            // Compara a senha fornecida com o hash armazenado
            const passwordMatches = comparePassword(
              password,
              storedPasswordHash
            );

            if (passwordMatches) {
              const userWithoutPassword = {
                id: user.id,
                email: user.email,
              };
              resolve(userWithoutPassword);
            } else {
              reject(new Error('Email ou senha inválidos'));
            }
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
