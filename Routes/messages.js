// routes/messages.js
const express = require("express");
const router = express.Router();
const MessageModel = require("../Models/MessagesQ");
const UserModel = require("../Models/UserModel");
const { decryptMessage, encryptMessage } = require("../utils/crypto");
const path = require("path"); // ✅ Asegúrate de importar 'path'
const fs = require("fs");


// 📥 Obtener mensajes entre dos usuarios
router.get("/:userId/:chatUserId", async (req, res) => {
  try {
    console.log("Obteniendo mensajes entre usuarios");
    const { userId, chatUserId } = req.params;
    //const messages = await MessageModel.getMessagesBetweenUsers(userId, chatUserId);
    const Message = "hola me desencripteaste";
     const name = "pepe";
     const fecha = new Date(2025, 4, 13);
    /* Desencriptar los mensajes
    const decryptedMessages = messages.map((msg) => ({
      id: msg.id,
      senderId: msg.sender_id,
      receiverId: msg.receiver_id,
      senderName: msg.sender_name,
      message: decryptMessage(msg.message),
      createdAt: msg.created_at,
    }));*/
    // Desencriptar los mensajes
    const decryptedMessages = [{
      id: 1,
      senderId: 20,
      receiverId: 5,
      senderName: name,
      message: Message,
      createdAt: fecha,
    }];

    res.status(200).json(decryptedMessages);
  } catch (error) {
    console.error("Error al obtener los mensajes:", error);
    //res.status(500).json({ message: "Error al obtener los mensajes" });
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

    // Desencriptar el mensaje para verificar el contenido en el servidor
    const decryptedMessage = decryptMessage(message);
    console.log("Mensaje desencriptado:", decryptedMessage);
    /*
    // Guardar el mensaje encriptado en la base de datos
    await MessageModel.create({
      sender_id: senderId,
      receiver_id: receiverId,
      message, // Almacena el mensaje tal como llegó (encriptado)
    });*/

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

// 📥 Obtener mensajes no leídos
router.get("/unread/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    //const messages = await MessageModel.getUnreadMessages(userId);
   // res.status(200).json(messages);
  } catch (error) {
    console.error("Error al obtener los mensajes no leídos:", error);
    res.status(500).json({ message: "Error al obtener los mensajes no leídos" });
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
