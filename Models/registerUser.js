const pool = require("../db");

// Si quieres evitar guardar un password, puedes dejar el campo NULL o crear una columna "oauth" para identificar que el usuario se registró a través de Google y no tiene contraseña
const addUserGoogle = async (firstName, lastName, email, password, photo) => {
  try {
    const query = `
      INSERT INTO users (name, surname, mail, password, photo)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`;

    const result = await pool.query(query, [firstName, lastName, email, password, photo]);
    return result.rows[0];

  } catch (error) {
    console.error("Error al agregar usuario con Google:", error);
    throw error;
  }
};

const addData = async (name, surname, mail, password) => {
  try {
    const query = `
      INSERT INTO users (name, surname, mail, password)
      VALUES ($1, $2, $3, $4)
      RETURNING *`;
      
    const result = await pool.query(query, [name, surname, mail, password]);
    return result.rows[0];
  } catch (error) {
    console.error("Error al insertar datos:", error);
    return error;
  }
};

const addDataFirstStep = async (ubication, state, zipCode, mail) => {
  try {
    console.log("llegueee");
    const query = `UPDATE users SET city = $1, state = $2, cod_postal = $3 WHERE mail = $4`;
    const values = [ubication, state, zipCode, mail];
    const result = await pool.query(query, values);
    return result;
  } catch (error) {
    error.message = error.code;
    return error;
  }
};

async function addDataSecondStep(salary, paymentPeriod, mail) {
  const query = `
    UPDATE users
    SET salary = $1, pay_met = $2
    WHERE mail = $3
  `;
  const values = [salary, paymentPeriod, mail];
  return await pool.query(query, values);
}


module.exports = { addUserGoogle, addData, addDataFirstStep, addDataSecondStep };
