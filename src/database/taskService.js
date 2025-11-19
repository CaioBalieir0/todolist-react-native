import { getDB } from "./database";
import { Platform } from "react-native";

const isWeb =
  Platform.OS === "web" ||
  (typeof window !== "undefined" && typeof window.localStorage !== "undefined");

// ===============================
// GARANTE QUE O DB JÁ ESTÁ ABERTO
// ===============================
const requireDB = () => {
  const db = getDB();
  if (!db && !isWeb) {
    throw new Error("❌ Banco de dados não está inicializado ainda.");
  }
  return db;
};

// ====================================
// BUSCAR TAREFAS POR USUÁRIO
// ====================================
export const getTasks = async (idUser) => {
  if (!idUser) throw new Error("ID do usuário é obrigatório");

  if (isWeb) {
    const tasksJson = localStorage.getItem("tasks");
    const tasks = tasksJson ? JSON.parse(tasksJson) : [];
    return tasks
      .filter((task) => task.idUser === idUser)
      .sort((a, b) => b.id - a.id);
  }

  const db = requireDB();
  const rows = await db.getAllAsync(
    "SELECT * FROM tasks WHERE idUser = ? ORDER BY id DESC;",
    [idUser]
  );

  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    description: r.description || "",
    done: r.done === 1,
    idUser: r.idUser,
  }));
};

// ====================================
// CRIAR TAREFA
// ====================================
export const createTask = async (title, description = "", idUser) => {
  if (!idUser) throw new Error("ID do usuário é obrigatório");

  if (isWeb) {
    const tasksJson = localStorage.getItem("tasks");
    const tasks = tasksJson ? JSON.parse(tasksJson) : [];
    const newId =
      tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 1;

    const newTask = {
      id: newId,
      title,
      description,
      done: false,
      idUser,
    };

    tasks.push(newTask);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    return newId;
  }

  const db = requireDB();
  const result = await db.runAsync(
    "INSERT INTO tasks (title, description, done, idUser) VALUES (?, ?, 0, ?);",
    [title, description, idUser]
  );

  return result.lastInsertRowId;
};

// ====================================
// EDITAR TAREFA
// ====================================
export const updateTask = async (id, title, description = "", idUser) => {
  if (!idUser) throw new Error("ID do usuário é obrigatório");

  if (isWeb) {
    const tasksJson = localStorage.getItem("tasks");
    const tasks = tasksJson ? JSON.parse(tasksJson) : [];

    const idx = tasks.findIndex((t) => t.id === id && t.idUser === idUser);

    if (idx === -1) throw new Error("Tarefa não encontrada");

    tasks[idx].title = title;
    tasks[idx].description = description;

    localStorage.setItem("tasks", JSON.stringify(tasks));
    return;
  }

  const db = requireDB();
  const result = await db.runAsync(
    "UPDATE tasks SET title = ?, description = ? WHERE id = ? AND idUser = ?;",
    [title, description, id, idUser]
  );

  if (result.changes === 0)
    throw new Error("Tarefa não encontrada ou não pertence ao usuário");
};

// ====================================
// DELETAR TAREFA
// ====================================
export const deleteTask = async (id, idUser) => {
  if (!idUser) throw new Error("ID do usuário é obrigatório");

  if (isWeb) {
    const tasksJson = localStorage.getItem("tasks");
    const tasks = tasksJson ? JSON.parse(tasksJson) : [];

    const newList = tasks.filter((t) => !(t.id === id && t.idUser === idUser));

    if (newList.length === tasks.length)
      throw new Error("Tarefa não encontrada ou não pertence ao usuário");

    localStorage.setItem("tasks", JSON.stringify(newList));
    return;
  }

  const db = requireDB();
  const result = await db.runAsync(
    "DELETE FROM tasks WHERE id = ? AND idUser = ?;",
    [id, idUser]
  );

  if (result.changes === 0)
    throw new Error("Tarefa não encontrada ou não pertence ao usuário");
};

// ====================================
// ALTERAR STATUS
// ====================================
export const toggleDone = async (id, currentValue, idUser) => {
  if (!idUser) throw new Error("ID do usuário é obrigatório");

  if (isWeb) {
    const tasksJson = localStorage.getItem("tasks");
    const tasks = tasksJson ? JSON.parse(tasksJson) : [];

    const idx = tasks.findIndex((t) => t.id === id && t.idUser === idUser);

    if (idx === -1)
      throw new Error("Tarefa não encontrada ou não pertence ao usuário");

    tasks[idx].done = !currentValue;

    localStorage.setItem("tasks", JSON.stringify(tasks));
    return;
  }

  const db = requireDB();
  const newValue = currentValue ? 0 : 1;

  const result = await db.runAsync(
    "UPDATE tasks SET done = ? WHERE id = ? AND idUser = ?;",
    [newValue, id, idUser]
  );

  if (result.changes === 0)
    throw new Error("Tarefa não encontrada ou não pertence ao usuário");
};
