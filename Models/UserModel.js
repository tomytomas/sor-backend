// UserModel.js
const pool = require('../db');

class UserModel {
  static async findByPk(userId) {
    try {
      const query = 'SELECT public_key FROM users WHERE id = $1';
      const values = [userId];
      const result = await pool.query(query, values);
      if (result.rows.length === 0) {
        throw new Error('Clave pública no encontrada para el usuario.');
      }
      return result.rows[0].public_key;
    } catch (error) {
      console.error('Error al obtener la clave pública del usuario:', error);
      throw error;
    }
  }
}

module.exports = UserModel;
