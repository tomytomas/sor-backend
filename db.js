import mysql from "mysql";
import util from "util";

const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
});

pool.query = util.promisify(pool.query);

export default pool;
