// routes/messages.js
const express = require("express");
const router = express.Router();
const MessageModel = require("../Models/MessagesQ");
const UserModel = require("../Models/UserModel");
const { decryptMessage} = require("../utils/crypto");
const path = require("path"); // ✅ Asegúrate de importar 'path'
const fs = require("fs");


// 📥 Obtener mensajes no leídos con el nombre del remitente
router.get("/unread/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Validación básica
    if (!userId || isNaN(userId)) {
      return res.status(400).json({ message: "ID de usuario inválido" });
    }

    console.log(`🔍 Buscando mensajes no leídos para el usuario ${userId}`);
    
    const messages = await MessageModel.getUnreadMessages(userId);

    if (!messages || messages.length === 0) {
      return res.status(200).json([]); // No hay mensajes no leídos
    }

    const decryptedMessages = messages.map((msg) => {
      let decryptedText = null;
      if (msg.encrypt_message) {
        try {
          decryptedText = decryptMessage(msg.encrypt_message);
        } catch (error) {
          console.error(`❌ Error desencriptando mensaje ID ${msg.id}:`, error.message);
        }
      }

      return {
        id: msg.id,
        senderId: msg.remit_id,
        senderName: msg.sender_name, // ✅ nombre del remitente
        receiverId: msg.destin_id,
        message: decryptedText,
        createdAt: msg.date,
        read: msg.read,
      };
    });

    res.status(200).json(decryptedMessages);
  } catch (error) {
    console.error("❌ Error al obtener los mensajes no leídos:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});



// 📥 Obtener mensajes entre dos usuarios
router.get("/:userId/:chatUserId", async (req, res) => {
  try {
    console.log("Obteniendo mensajes entre usuarios");
    const { userId, chatUserId } = req.params;

    const messages = await MessageModel.getMessagesBetweenUsers(userId, chatUserId);

    if (!messages || messages.length === 0) {
      console.warn(`No hay mensajes entre los usuarios ${userId} y ${chatUserId}`);
      return res.status(200).json([]);
    }

    // Marcar como leídos los mensajes que recibió el userId desde chatUserId
    await MessageModel.markMessagesAsRead(userId, chatUserId);

    const receiver = await MessageModel.getUserById(chatUserId);
    const receiverName = receiver?.name || "Desconocido";

    const decryptedMessages = messages.map((msg) => {
      let decryptedText = null;
      if (msg.encrypt_message) {
        try {
          decryptedText = decryptMessage(msg.encrypt_message);
        } catch (error) {
          console.error(`Error desencriptando mensaje id ${msg.id}:`, error.message);
        }
      }

      return {
        id: msg.id,
        senderId: msg.remit_id,
        receiverId: msg.destin_id,
        message: decryptedText,
        createdAt: msg.date,
        read: msg.read,
        receiverName: receiverName,
      };
    });

    res.status(200).json(decryptedMessages);
  } catch (error) {
    console.error("Error al obtener los mensajes:", error);
    res.status(500).json({ message: "Error al obtener los mensajes" });
  }
});




router.get("/public-key", async (req, res) => {
  try {
    // Ruta del archivo de la clave pública
    console.log("Obteniendo clave pública");
    const publicKeyPath = path.join(__dirname, "..", "certificates", "public_key.pem");

    // Verifica si el archivo existe
    if (!fs.existsSync(publicKeyPath)) {
      return res.status(404).json({ message: "Clave pública no encontrada" });
    }

    // Lee el archivo de clave pública
    const publicKey = fs.readFileSync(publicKeyPath, "utf8");
    // Prueba rápida


    
    res.status(200).json({ publicKey });
  } catch (error) {
    console.error("Error al obtener la clave pública:", error);
    res.status(500).json({ message: "Error al obtener la clave pública" });
  }
});

module.exports = router;

// 📥 Enviar mensaje
router.post("/send", async (req, res) => {
  try {
    console.log("Datos recibidos:", req.body);
    const { senderId, receiverId, message } = req.body;

    if (!senderId || !receiverId || !message) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    // Extraer solo la hora
   const currentTime = new Date().toISOString(); // UTC en formato completo y válido


    // Guardar el mensaje encriptado en la base de datos
    await MessageModel.create({
      remit_id: senderId,
      destin_id: receiverId,
      encrypt_message: message,
      date: currentTime,
      read: false
    });

    res.status(200).json({ message: "Mensaje enviado correctamente" });
  } catch (error) {
    console.error("Error enviando mensaje:", error);
    res.status(500).json({ message: "Error enviando mensaje" });
  }
});



// 📥 Obtener mensajes recibidos (desencriptados)
router.get("/received/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const messages = await MessageModel.getReceivedMessages(userId);

    // Desencriptar los mensajes
    const decryptedMessages = messages.map((msg) => ({
      id: msg.id,
      senderId: msg.sender_id,
      message: decryptMessage(msg.message),
      read: msg.read,
    }));

    res.status(200).json(decryptedMessages);
  } catch (error) {
    console.error("Error obteniendo mensajes recibidos:", error);
    res.status(500).json({ message: "Error en el servidor al obtener mensajes" });
  }
});



// 📩 Marcar mensaje como leído
router.put("/read", async (req, res) => {
  try {
    const { messageId, userId } = req.body;

    if (!messageId || !userId) {
      return res.status(400).json({ message: "messageId y userId son requeridos" });
    }

    await MessageModel.markAsRead(messageId, userId);
    res.status(200).json({ message: "Mensaje marcado como leído" });
  } catch (error) {
    console.error("Error al marcar mensaje como leído:", error);
    res.status(500).json({ message: "Error en el servidor al marcar el mensaje como leído" });
  }
});

module.exports = router;
