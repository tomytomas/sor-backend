const express = require("express");
const path = require("path");


const session = require("express-session");
const morgan = require("morgan");
const cors = require("cors");
const { tokenVerify } = require("./util/handleJWT"); 
require("dotenv").config();
const app = express();



app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000', // URL de tu frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Permitir otros métodos si es necesario
  allowedHeaders: ['Content-Type', 'Authorization'], // Permitir encabezados como 'Authorization'
  credentials: true, // Si estás trabajando con sesiones o cookies, habilita esto
}));

app.use((req, res, next) => {
  res.setHeader('Referrer-Policy', 'no-referrer-when-downgrade');
  next();
});


//const data = require("./routes/datos")
//const contact = require("./routes/contact"); 
const routeRegister = require("./Routes/register");
const routeLogin = require("./Routes/login");
const RoutePost = require("./Routes/datos");
const routermessages = require("./Routes/messages");




app.use(express.static(path.resolve(__dirname, "./client/dist")))
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(express.static(path.join(__dirname, "public")));



app.use(
  session({
    secret: process.env.SESSION_SECRET || 'dev-secret',
    resave: true,
    saveUninitialized: true,
  })
);

const isAuth = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Extraer el JWT desde el header

  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  try {
    const user = await tokenVerify(token); // Verificar el JWT
    if (!user) {
      return res.status(401).json({ error: 'Token inválido' });
    }
    req.user = user; // Puedes agregar la info del usuario a la request
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};

app.use(morgan('tiny'));

// 1. Autenticación y usuarios
app.use("/register", routeRegister);
app.use("/login", routeLogin);
app.use("/messages", routermessages); // Middleware de autenticación para mensajes
// 2. Datos o recursos protegidos
app.use("/datos", RoutePost);

// 3. Home y páginas públicas (si tienes vistas o SSR)

app.post("/verify", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.sendStatus(401); // Unauthorized
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = await tokenVerify(token);
    return res.status(200).json({ access: true, user: decoded });
  } catch (err) {
    return res.status(401).json({ access: false, error: "Token inválido" });
  }
});

app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ ok: true, serverTime: result.rows[0].now });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

//catch all route (404)
app.use((req, res, next) => {
  let error = new Error("Recurso no encontrado");
  error.status = 404
  next(error)
})

app.use((error, req, res, next) => {
  if (!error.status) {
      error.status = 500
  }
  res.status(error.status).json({ status: error.status, message: "no se pudo cargar la pagina" })
})

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', (err) => {
  err
  ? console.log("explotó todo 😫")
  : console.log(`Servidor corre en http://localhost:${PORT}`);
});