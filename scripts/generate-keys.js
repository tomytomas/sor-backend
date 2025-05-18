// scripts/generate-keys.js
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

function generateKeys(userId) {
  const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 4096,
    publicKeyEncoding: { type: "spki", format: "pem" },
    privateKeyEncoding: { type: "pkcs8", format: "pem" },
  });

  const dir = path.join(__dirname, "../keys", userId.toString());
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "public.pem"), publicKey);
  fs.writeFileSync(path.join(dir, "private.pem"), privateKey);
  
  console.log(`🔑 Claves generadas para el usuario ${userId}`);
}

// Generar claves para los usuarios (puedes agregar más usuarios aquí)
generateKeys(1);
generateKeys(2);
