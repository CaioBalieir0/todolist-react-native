import db, { initDatabase } from './database';
import { Platform } from 'react-native';

// Detecta se está na web de forma mais robusta
const isWeb =
  Platform.OS === 'web' ||
  (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined');

// Inicializa o banco quando o serviço é importado
initDatabase().catch(console.error);

// Retorna todas as tarefas
export const getTasks = () => {
  return new Promise((resolve, reject) => {
    if (isWeb) {
      try {
        const tasksJson = localStorage.getItem('tasks');
        const tasks = tasksJson ? JSON.parse(tasksJson) : [];
        // Ordena por id descendente
        tasks.sort((a, b) => b.id - a.id);
        resolve(tasks);
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
        'SELECT * FROM tasks ORDER BY id DESC;',
        [],
        (_, { rows }) => {
          const tasks = [];
          for (let i = 0; i < rows.length; i++) {
            tasks.push({
              id: rows.item(i).id,
              title: rows.item(i).title,
              description: rows.item(i).description || '',
              done: rows.item(i).done === 1,
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
export const createTask = (title, description = '') => {
  return new Promise((resolve, reject) => {
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
        'INSERT INTO tasks (title, description, done) VALUES (?, ?, 0);',
        [title, description],
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

// Atualiza uma tarefa existente
export const updateTask = (id, title, description = '') => {
  return new Promise((resolve, reject) => {
    if (isWeb) {
      try {
        const tasksJson = localStorage.getItem('tasks');
        const tasks = tasksJson ? JSON.parse(tasksJson) : [];
        const taskIndex = tasks.findIndex((t) => t.id === id);
        if (taskIndex === -1) {
          reject(new Error('Tarefa não encontrada'));
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
        'UPDATE tasks SET title = ?, description = ? WHERE id = ?;',
        [title, description, id],
        (_, { rowsAffected }) => {
          if (rowsAffected > 0) {
            resolve();
          } else {
            reject(new Error('Tarefa não encontrada'));
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

// Exclui uma tarefa
export const deleteTask = (id) => {
  return new Promise((resolve, reject) => {
    // Verifica novamente dentro da função para garantir
    const isWebCheck =
      Platform.OS === 'web' ||
      (typeof window !== 'undefined' &&
        typeof window.localStorage !== 'undefined');

    // Garante que o ID seja um número
    const taskId = typeof id === 'string' ? parseInt(id, 10) : id;

    console.log(
      'deleteTask chamado - isWeb:',
      isWeb,
      'isWebCheck:',
      isWebCheck,
      'taskId:',
      taskId,
      'id original:',
      id
    );

    if (isWeb || isWebCheck) {
      try {
        // Garante que o localStorage está disponível
        if (typeof window === 'undefined' || !window.localStorage) {
          console.error('localStorage não disponível para exclusão');
          reject(new Error('localStorage não disponível'));
          return;
        }

        const tasksJson = localStorage.getItem('tasks');
        console.log('tasksJson antes da exclusão:', tasksJson);
        const tasks = tasksJson ? JSON.parse(tasksJson) : [];
        console.log('Tarefas antes da exclusão:', tasks.length);
        console.log(
          'IDs das tarefas:',
          tasks.map((t) => ({ id: t.id, type: typeof t.id }))
        );

        const filteredTasks = tasks.filter((t) => {
          const tId = typeof t.id === 'string' ? parseInt(t.id, 10) : t.id;
          const match = tId !== taskId;
          console.log(
            `Comparando: tId=${tId} (${typeof tId}) !== taskId=${taskId} (${typeof taskId}) = ${match}`
          );
          return match;
        });

        console.log('Tarefas após filtro:', filteredTasks.length);

        if (filteredTasks.length === tasks.length) {
          console.error(
            'Nenhuma tarefa foi removida. Tarefa não encontrada com ID:',
            taskId
          );
          reject(new Error('Tarefa não encontrada'));
          return;
        }

        localStorage.setItem('tasks', JSON.stringify(filteredTasks));
        console.log(
          'Tarefa excluída com sucesso. Tarefas restantes:',
          filteredTasks.length
        );
        console.log(
          'Verificando localStorage após exclusão:',
          localStorage.getItem('tasks')
        );
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
        'DELETE FROM tasks WHERE id = ?;',
        [taskId],
        (_, { rowsAffected }) => {
          if (rowsAffected > 0) {
            resolve();
          } else {
            reject(new Error('Tarefa não encontrada'));
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

// Alterna o status de conclusão da tarefa
export const toggleDone = (id, currentValue) => {
  return new Promise((resolve, reject) => {
    if (isWeb) {
      try {
        const tasksJson = localStorage.getItem('tasks');
        const tasks = tasksJson ? JSON.parse(tasksJson) : [];
        const taskIndex = tasks.findIndex((t) => t.id === id);
        if (taskIndex === -1) {
          reject(new Error('Tarefa não encontrada'));
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
        'UPDATE tasks SET done = ? WHERE id = ?;',
        [newValue, id],
        (_, { rowsAffected }) => {
          if (rowsAffected > 0) {
            resolve();
          } else {
            reject(new Error('Tarefa não encontrada'));
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
