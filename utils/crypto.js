// backend/utils/crypto.js
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

// Cargar claves
const privateKey = fs.readFileSync(path.join(__dirname, "../certificates/private_key.pem"), "utf8");
const publicKey = fs.readFileSync(path.join(__dirname, "../certificates/public_key.pem"), "utf8");

// Función para desencriptar un mensaje
function decryptMessage(encryptedMessage) {
    return crypto.privateDecrypt(
        {
            key: privateKey,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: "sha256",
        },
        Buffer.from(encryptedMessage, "base64")
    ).toString();
}

module.exports = { decryptMessage };
