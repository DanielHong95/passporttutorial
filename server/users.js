const { Pool } = require("pg");
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

const createUsersTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL
    )
    `;
  try {
    await pool.query(query);
    console.log("users table created");
  } catch (err) {
    console.error(err);
  }
};

createUsersTable();
