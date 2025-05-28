const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false
  }
});
// Test de conexión
pool.query("SELECT NOW()")
  .then((res) => {
    console.log("✅ Conectado a PostgreSQL. Hora del servidor:", res.rows[0].now);
  })
  .catch((err) => {
    console.error("❌ Error al conectar a PostgreSQL:", err.message);
  });

module.exports = pool;
