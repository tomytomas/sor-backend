const express = require("express");
const path = require("path");
const http = require("http");
const session = require("express-session");
const morgan = require("morgan");
const cors = require("cors");
const { tokenVerify } = require("./util/handleJWT");
const { decryptMessage } = require("./utils/crypto");
require("dotenv").config();

const app = express();
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

// 📦 Rutas
const routeRegister = require("./Routes/register");
const routeLogin = require("./Routes/login");
const RoutePost = require("./Routes/datos");
const routermessages = require("./Routes/messages");

// 🌐 Middlewares
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use((req, res, next) => {
  res.setHeader("Referrer-Policy", "no-referrer-when-downgrade");
  next();
});

app.use(express.static(path.resolve(__dirname, "./client/dist")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev-secret",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(morgan("tiny"));

// 🔐 Verificación JWT
const isAuth = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token no proporcionado" });

  try {
    const user = await tokenVerify(token);
    if (!user) return res.status(401).json({ error: "Token inválido" });

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
};

// 📌 Rutas API
app.use("/register", routeRegister);
app.use("/login", routeLogin);
app.use("/messages", routermessages);
app.use("/datos", RoutePost);

// 🧪 Test Token
app.post("/verify", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.sendStatus(401);
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = await tokenVerify(token);
    return res.status(200).json({ access: true, user: decoded });
  } catch (err) {
    return res.status(401).json({ access: false, error: "Token inválido" });
  }
});

// ⚠️ 404 handler
app.use((req, res, next) => {
  let error = new Error("Recurso no encontrado");
  error.status = 404;
  next(error);
});

// ⚠️ Error handler
app.use((error, req, res, next) => {
  if (!error.status) error.status = 500;
  res
    .status(error.status)
    .json({ status: error.status, message: "no se pudo cargar la pagina" });
});

// 🔌 SOCKET.IO
io.on("connection", (socket) => {
  console.log("🟢 Usuario conectado:", socket.id);

  socket.on("join_room", ({ userId, chatUserId }) => {
    const roomId =
      userId < chatUserId ? `${userId}_${chatUserId}` : `${chatUserId}_${userId}`;
    socket.join(roomId);
    console.log(`👤 Usuario ${userId} se unió a la sala ${roomId}`);
  });

  socket.on("leave_room", ({ userId, chatUserId }) => {
    const roomId =
      userId < chatUserId ? `${userId}_${chatUserId}` : `${chatUserId}_${userId}`;
    socket.leave(roomId);
    console.log(`👤 Usuario ${userId} salió de la sala ${roomId}`);
  });

  socket.on("send_message", (data) => {
    console.log("📨 Mensaje cifrado recibido:", data);

    const { senderId, receiverId, message, senderName } = data;

    let decryptedMessage;
    try {
      decryptedMessage = decryptMessage(message);
    } catch (err) {
      console.error("❌ Error al desencriptar el mensaje:", err);
      return;
    }

    const roomId =
      senderId < receiverId ? `${senderId}_${receiverId}` : `${receiverId}_${senderId}`;

    const messageToSend = {
      ...data,
      message: decryptedMessage,
      senderName,
    };

    socket.to(roomId).emit("receive_message", messageToSend);
  });

  socket.on("disconnect", () => {
    console.log("🔴 Usuario desconectado:", socket.id);
  });
});

// 🚀 Iniciar servidor
const PORT = process.env.PORT || 8080;
server.listen(PORT, "0.0.0.0", (err) => {
  if (err) {
    console.log("explotó todo 😫");
  } else {
    console.log(`Servidor corre en http://localhost:${PORT}`);
  }
});
