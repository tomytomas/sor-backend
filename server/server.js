const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

// Leer las claves del servidor
const serverPrivateKey = fs.readFileSync(path.join(__dirname, "keys/server.key"), "utf8");
const serverPublicKey = fs.readFileSync(path.join(__dirname, "keys/server.pub"), "utf8");

// Rutas del servidor
app.get("/", (req, res) => res.send("Servidor de Mensajería Seguro en Node.js"));

// Iniciar servidor
app.listen(8080, () => console.log("Servidor escuchando en el puerto 8080"));
