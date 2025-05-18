// models/messages.js
const pool = require("../db");
const { encryptMessage, decryptMessage } = require("../utils/crypto");

const MessageModel = {
  // Obtener mensajes entre dos usuarios (desencriptados)
  getMessagesBetweenUsers: async (userId, chatUserId) => {
    const query = `
      SELECT m.id, m.sender_id, m.receiver_id, m.message, m.created_at, u.name AS sender_name
      FROM messages m
      JOIN users u ON m.sender_id = u.id
      WHERE (m.sender_id = $1 AND m.receiver_id = $2) OR (m.sender_id = $2 AND m.receiver_id = $1)
      ORDER BY m.created_at ASC;
    `;
    const result = await pool.query(query, [userId, chatUserId]);

    // Desencriptar mensajes
    return result.rows.map((msg) => ({
      id: msg.id,
      senderId: msg.sender_id,
      receiverId: msg.receiver_id,
      senderName: msg.sender_name,
      message: decryptMessage(userId, msg.message),
      createdAt: msg.created_at,
    }));
  },

  // Obtener mensajes no leídos (desencriptados)
  getUnreadMessages: async (userId) => {
    const query = `
      SELECT m.id, m.sender_id, m.receiver_id, m.message, m.created_at, u.name AS sender_name
      FROM messages m
      JOIN users u ON m.sender_id = u.id
      WHERE m.receiver_id = $1 AND m.read = false
      ORDER BY m.created_at DESC;
    `;
    const result = await pool.query(query, [userId]);

    // Desencriptar mensajes
    return result.rows.map((msg) => ({
      id: msg.id,
      senderId: msg.sender_id,
      receiverId: msg.receiver_id,
      senderName: msg.sender_name,
      message: decryptMessage(userId, msg.message),
      createdAt: msg.created_at,
    }));
  },

  // Obtener mensajes recibidos y desencriptados
  getReceivedMessages: async (userId) => {
    const query = "SELECT id, sender_id, message, read FROM messages WHERE receiver_id = $1";
    const result = await pool.query(query, [userId]);

    // Desencriptar mensajes
    return result.rows.map((msg) => ({
      id: msg.id,
      senderId: msg.sender_id,
      message: decryptMessage(userId, msg.message),
      read: msg.read,
    }));
  },

  // Enviar un mensaje encriptado
  sendMessage: async (senderId, receiverId, message) => {
    const encryptedMessage = encryptMessage(receiverId, message);
    const query = "INSERT INTO messages (sender_id, receiver_id, message, read) VALUES ($1, $2, $3, $4)";
    await pool.query(query, [senderId, receiverId, encryptedMessage, false]);
  },

  // Marcar mensaje como leído
  markAsRead: async (messageId, userId) => {
    const query = `
      UPDATE messages
      SET read = true
      WHERE id = $1 AND receiver_id = $2;
    `;
    await pool.query(query, [messageId, userId]);
  },
};

module.exports = MessageModel;
