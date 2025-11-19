import { Platform } from "react-native";
import * as SQLite from "expo-sqlite/next";

const isWeb = Platform.OS === "web";
let db = null;

export const getDB = () => db;

// =========================
// WEB → localStorage
// =========================
const initWebDB = () => {
  if (!localStorage.getItem("users")) {
    localStorage.setItem(
      "users",
      JSON.stringify([
        { id: 1, email: "admin@example.com", password: "123456" },
      ])
    );
  }

  if (!localStorage.getItem("tasks")) {
    localStorage.setItem("tasks", JSON.stringify([]));
  }

  console.log("🌐 Banco Web inicializado");
};

// =========================
// MOBILE → SQLite NEXT (SDK 51)
// =========================
export async function initDatabase() {
  if (isWeb) {
    initWebDB();
    return null;
  }

  console.log("📦 Abrindo SQLite (API Next)");

  db = await SQLite.openDatabaseAsync("todo.db");

  await db.execAsync(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      done INTEGER DEFAULT 0,
      idUser INTEGER NOT NULL,
      FOREIGN KEY (idUser) REFERENCES users(id)
    );
  `);

  console.log("📌 Tabelas criadas com sucesso (SQLite Next)");

  // ============================
  // ADICIONA USUÁRIO DEFAULT
  // ============================

  const existingUsers = await db.getAllAsync("SELECT * FROM users LIMIT 1");

  if (existingUsers.length === 0) {
    await db.runAsync("INSERT INTO users (email, password) VALUES (?, ?)", [
      "admin@example.com",
      "123456",
    ]);

    console.log("👤 Usuário padrão criado (admin@example.com / 123456)");
  } else {
    console.log(
      "👤 Usuário padrão já existe, não será recriado",
      existingUsers
    );
  }

  return db;
}
