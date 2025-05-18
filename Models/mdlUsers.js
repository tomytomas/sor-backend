const pool = require("../db");

const getUser = async (mail) => {
  try {
    const normalizedMail = mail;

    const query = `
    SELECT id, name, mail, password
    FROM users
    WHERE mail = $1
    LIMIT 1
  `;
    const result = await pool.query(query, [normalizedMail]);

    if (result.rows.length === 0) {
      return null; // O puedes lanzar un error si lo preferís
    }

    return result.rows[0];

  } catch (error) {
    console.error("Error obteniendo usuario:", error);
    throw error;
  }
};


const getAllUsers = async () => {
  try {
    const query = "SELECT * FROM users";
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Error retrieving users from the database");
  }
};


module.exports = {
  getAllUsers,
  getUser,
  
};
