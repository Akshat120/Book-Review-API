import sqlite3 from 'sqlite3';

import dotenv from 'dotenv';

dotenv.config();

const db = new sqlite3.Database(process.env.DATABASE_PATH, (err) => {
    if (err) {
      console.error('Error connecting to SQLite:', err.message);
    } else {
      console.log('Connected to SQLite database.');
    }
})
