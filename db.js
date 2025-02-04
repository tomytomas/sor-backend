import mysql from "mysql2";
import util from "util";

const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT
}); 
pool.getConnection((err, connection) => {
  if (err) {
    console.error("❌ Error en la conexión a la base de datos:", err);
  } else {
    console.log("✅ Conectado correctamente a la base de datos");
    connection.release(); // Liberar la conexión después de la prueba
  }
});


pool.query = util.promisify(pool.query);

export default pool;
