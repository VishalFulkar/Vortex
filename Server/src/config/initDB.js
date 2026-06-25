const pool = require("./db");

const initDB = async () => {
  const initTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        storage_used BIGINT DEFAULT 0,
        storage_quota BIGINT DEFAULT 5368709120, -- 5GB default
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
  try {
    await pool.query(initTableQuery);
    console.log("Database connected and users table verified/created successfully");
  } catch (err) {
    console.error("Database initialization failed:", err.message);
    process.exit(1);
  }
};

module.exports = initDB;
