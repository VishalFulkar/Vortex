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

      CREATE TABLE IF NOT EXISTS folders (
        id          SERIAL PRIMARY KEY,
        name        VARCHAR(255) NOT NULL,
        user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        parent_id   INTEGER REFERENCES folders(id) ON DELETE CASCADE,
        created_at  TIMESTAMP DEFAULT NOW(),
        updated_at  TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS files (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        original_name VARCHAR(255),
        path TEXT NOT NULL,
        size BIGINT,
        mimetype VARCHAR(100),
        hash VARCHAR(64),
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        folder_id INT REFERENCES folders(id) ON DELETE SET NULL,
        is_deleted BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS activity_logs (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        file_id INT REFERENCES files(id) ON DELETE CASCADE,
        action VARCHAR(20) CHECK (action IN ('upload', 'download', 'delete', 'share', 'restore', 'view')),
        ip_address VARCHAR(50),
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS permissions (
        id SERIAL PRIMARY KEY,
        file_id INT REFERENCES files(id) ON DELETE CASCADE,
        shared_with INT REFERENCES users(id) ON DELETE CASCADE,
        access_level VARCHAR(10) CHECK (access_level IN ('view', 'edit')),
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;
  try {
    await pool.query(initTableQuery);
    console.log("Database connected and tables verified/created successfully");
  } catch (err) {
    console.error("Database initialization failed:", err.message);
    process.exit(1);
  }
};

module.exports = initDB;
