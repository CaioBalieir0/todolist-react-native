import db, { initDatabase } from './database';
import { Platform } from 'react-native';

// Detecta se está na web de forma mais robusta
const isWeb =
  Platform.OS === 'web' ||
  (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined');

// Inicializa o banco quando o serviço é importado
initDatabase().catch(console.error);

// Retorna todas as tarefas de um usuário
export const getTasks = (idUser) => {
  return new Promise((resolve, reject) => {
    if (!idUser) {
      reject(new Error('ID do usuário é obrigatório'));
      return;
    }

    if (isWeb) {
      try {
        const tasksJson = localStorage.getItem('tasks');
        const tasks = tasksJson ? JSON.parse(tasksJson) : [];
        // Filtra tarefas do usuário e ordena por id descendente
        const userTasks = tasks
          .filter((task) => task.idUser === idUser)
          .sort((a, b) => b.id - a.id);
        resolve(userTasks);
      } catch (error) {
        console.error('Erro ao buscar tarefas:', error);
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
        'SELECT * FROM tasks WHERE idUser = ? ORDER BY id DESC;',
        [idUser],
        (_, { rows }) => {
          const tasks = [];
          for (let i = 0; i < rows.length; i++) {
            tasks.push({
              id: rows.item(i).id,
              title: rows.item(i).title,
              description: rows.item(i).description || '',
              done: rows.item(i).done === 1,
              idUser: rows.item(i).idUser,
            });
          }
          resolve(tasks);
        },
        (_, error) => {
          console.error('Erro ao buscar tarefas:', error);
          reject(error);
        }
      );
    });
  });
};

// Cria uma nova tarefa
export const createTask = (title, description = '', idUser) => {
  return new Promise((resolve, reject) => {
    if (!idUser) {
      reject(new Error('ID do usuário é obrigatório'));
      return;
    }

    if (isWeb) {
      try {
        const tasksJson = localStorage.getItem('tasks');
        const tasks = tasksJson ? JSON.parse(tasksJson) : [];
        const newId =
          tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 1;
        const newTask = {
          id: newId,
          title,
          description,
          done: false,
          idUser: idUser,
        };
        tasks.push(newTask);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        resolve(newId);
      } catch (error) {
        console.error('Erro ao criar tarefa:', error);
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
        'INSERT INTO tasks (title, description, done, idUser) VALUES (?, ?, 0, ?);',
        [title, description, idUser],
        (_, { insertId }) => {
          resolve(insertId);
        },
        (_, error) => {
          console.error('Erro ao criar tarefa:', error);
          reject(error);
        }
      );
    });
  });
};

// Atualiza uma tarefa existente (verifica se pertence ao usuário)
export const updateTask = (id, title, description = '', idUser) => {
  return new Promise((resolve, reject) => {
    if (!idUser) {
      reject(new Error('ID do usuário é obrigatório'));
      return;
    }
    if (isWeb) {
      try {
        const tasksJson = localStorage.getItem('tasks');
        const tasks = tasksJson ? JSON.parse(tasksJson) : [];
        const taskIndex = tasks.findIndex((t) => {
          const tId = typeof t.id === 'string' ? parseInt(t.id, 10) : t.id;
          const finalId = typeof id === 'string' ? parseInt(id, 10) : id;
          return tId === finalId && t.idUser === idUser;
        });

        if (taskIndex === -1) {
          reject(new Error('Tarefa não encontrada ou não pertence ao usuário'));
          return;
        }

        tasks[taskIndex] = {
          ...tasks[taskIndex],
          title,
          description,
        };
        localStorage.setItem('tasks', JSON.stringify(tasks));
        resolve();
      } catch (error) {
        console.error('Erro ao atualizar tarefa:', error);
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
        'UPDATE tasks SET title = ?, description = ? WHERE id = ? AND idUser = ?;',
        [title, description, id, idUser],
        (_, { rowsAffected }) => {
          if (rowsAffected > 0) {
            resolve();
          } else {
            reject(
              new Error('Tarefa não encontrada ou não pertence ao usuário')
            );
          }
        },
        (_, error) => {
          console.error('Erro ao atualizar tarefa:', error);
          reject(error);
        }
      );
    });
  });
};

// Exclui uma tarefa (verifica se pertence ao usuário)
export const deleteTask = (id, idUser) => {
  return new Promise((resolve, reject) => {
    if (!idUser) {
      reject(new Error('ID do usuário é obrigatório'));
      return;
    }
    if (isWeb) {
      try {
        if (typeof window === 'undefined' || !window.localStorage) {
          reject(new Error('localStorage não disponível'));
          return;
        }

        const tasksJson = localStorage.getItem('tasks');
        const tasks = tasksJson ? JSON.parse(tasksJson) : [];

        // Filtra removendo a tarefa que corresponde ao id E pertence ao usuário
        const filteredTasks = tasks.filter((t) => {
          const tId = typeof t.id === 'string' ? parseInt(t.id, 10) : t.id;
          const finalId = typeof id === 'string' ? parseInt(id, 10) : id;
          // Mantém tarefas que não são a que queremos excluir OU não pertencem ao usuário
          return !(tId === finalId && t.idUser === idUser);
        });

        if (filteredTasks.length === tasks.length) {
          reject(new Error('Tarefa não encontrada ou não pertence ao usuário'));
          return;
        }

        localStorage.setItem('tasks', JSON.stringify(filteredTasks));
        resolve();
      } catch (error) {
        console.error('Erro ao excluir tarefa:', error);
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
        'DELETE FROM tasks WHERE id = ? AND idUser = ?;',
        [id, idUser],
        (_, { rowsAffected }) => {
          if (rowsAffected > 0) {
            resolve();
          } else {
            reject(
              new Error('Tarefa não encontrada ou não pertence ao usuário')
            );
          }
        },
        (_, error) => {
          console.error('Erro ao excluir tarefa:', error);
          reject(error);
        }
      );
    });
  });
};

// Alterna o status de conclusão da tarefa (verifica se pertence ao usuário)
export const toggleDone = (id, currentValue, idUser) => {
  return new Promise((resolve, reject) => {
    if (!idUser) {
      reject(new Error('ID do usuário é obrigatório'));
      return;
    }
    if (isWeb) {
      try {
        const tasksJson = localStorage.getItem('tasks');
        const tasks = tasksJson ? JSON.parse(tasksJson) : [];
        const taskIndex = tasks.findIndex((t) => {
          const tId = typeof t.id === 'string' ? parseInt(t.id, 10) : t.id;
          const finalId = typeof id === 'string' ? parseInt(id, 10) : id;
          return tId === finalId && t.idUser === idUser;
        });

        if (taskIndex === -1) {
          reject(new Error('Tarefa não encontrada ou não pertence ao usuário'));
          return;
        }

        tasks[taskIndex] = {
          ...tasks[taskIndex],
          done: !currentValue,
        };
        localStorage.setItem('tasks', JSON.stringify(tasks));
        resolve();
      } catch (error) {
        console.error('Erro ao atualizar status da tarefa:', error);
        reject(error);
      }
      return;
    }

    if (!db) {
      reject(new Error('Banco de dados não disponível'));
      return;
    }

    const newValue = currentValue ? 0 : 1;
    db.transaction((tx) => {
      tx.executeSql(
        'UPDATE tasks SET done = ? WHERE id = ? AND idUser = ?;',
        [newValue, id, idUser],
        (_, { rowsAffected }) => {
          if (rowsAffected > 0) {
            resolve();
          } else {
            reject(
              new Error('Tarefa não encontrada ou não pertence ao usuário')
            );
          }
        },
        (_, error) => {
          console.error('Erro ao atualizar status da tarefa:', error);
          reject(error);
        }
      );
    });
  });
};
