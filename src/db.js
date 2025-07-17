const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = process.env.DB_PATH || './data/bot.db';
const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');

if (!fs.existsSync(path.dirname(dbPath))) {
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
}

const db = new sqlite3.Database(dbPath);

// apply schema
schema.split(';').filter(Boolean).forEach((stmt) => {
  db.run(stmt, (err) => {
    if (err) console.error(err);
  });
});

module.exports = db;
