const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./notes.db", (err) => {
  if (err) console.error(err.message);
  console.log("Connected to the SQLite database.");
});

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        category TEXT DEFAULT 'Others',
        completed BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
});

module.exports = db;
