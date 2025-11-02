import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mysql from "mysql2/promise";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// 🧩 Verbindung zur Datenbank herstellen
let db;
try {
  db = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  });
  console.log("✅ Mit der MySQL-Datenbank verbunden");
} catch (err) {
  console.error("❌ Fehler bei der DB-Verbindung:", err.message);
  process.exit(1); // Beendet den Server, wenn DB-Verbindung fehlschlägt
}

// 🧠 Testroute
app.get("/", (req, res) => {
  res.send("Backend läuft 🚀");
});

// 🧩 Beispiel-API: Daten aus Tabelle 'users' abrufen
app.get("/api/users", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM users LIMIT 10");
    res.json(rows);
  } catch (err) {
    console.error("Fehler bei DB-Abfrage:", err.message);
    res.status(500).json({ error: "Fehler bei der Datenbankabfrage" });
  }
});

// 🟢 Server starten
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});
