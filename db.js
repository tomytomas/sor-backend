const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'leloir2020',
  port: 5432
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
