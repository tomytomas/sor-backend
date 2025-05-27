// models/messages.js
const pool = require("../db");
const MessageModel = {
// crear msj
create: async ({ remit_id, destin_id, encrypt_message, date, read }) => {
    const query = `
      INSERT INTO messages (remit_id, destin_id, encrypt_message, date, read)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [remit_id, destin_id, encrypt_message, date, read];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  // Obtener usuario por ID
getUserById: async (userId) => {
  const query = `
    SELECT name 
    FROM users
    WHERE id = $1;
  `;
  const result = await pool.query(query, [userId]);
  return result.rows[0];
},



  // Obtener mensajes entre dos usuarios (sin desencriptar)
     getMessagesBetweenUsers: async (userId, chatUserId) => {
    const query = `
      SELECT id, remit_id, destin_id, encrypt_message, date, read
      FROM messages
      WHERE (remit_id = $1 AND destin_id = $2) 
         OR (remit_id = $2 AND destin_id = $1)
      ORDER BY date ASC;
    `;
    const result = await pool.query(query, [userId, chatUserId]);
  
    return result.rows;
  },



   // Marcar como leídos todos los mensajes recibidos de un remitente
  markMessagesAsRead: async (userId, chatUserId) => {
    const query = `
      UPDATE messages
      SET read = true
      WHERE destin_id = $1 AND remit_id = $2 AND read = false;
    `;
    await pool.query(query, [userId, chatUserId]);
  },

  // Obtener mensajes no leídos con nombre del remitente
  getUnreadMessages: async (userId) => {
    const query = `
      SELECT 
        m.id,
        m.remit_id,
        m.destin_id,
        m.encrypt_message,
        m.date,
        m.read,
        u.name AS sender_name
      FROM messages m
      JOIN users u ON m.remit_id = u.id
      WHERE m.destin_id = $1 AND m.read = false
      ORDER BY m.date DESC;
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  },

 

  // Enviar un mensaje (sin encriptar)
  sendMessage: async (senderId, receiverId, encryptedMessage) => {
    const query = "INSERT INTO messages (remit_id, destin_id, encrypt_message, date, read) VALUES ($1, $2, $3, NOW(), false)";
    await pool.query(query, [senderId, receiverId, encryptedMessage]);
  },

  // Marcar mensaje como leído
  markAsRead: async (messageId, userId) => {
    const query = `
      UPDATE messages
      SET read = true
      WHERE id = $1 AND destin_id = $2;
    `;
    await pool.query(query, [messageId, userId]);
  },
};

module.exports = MessageModel;

