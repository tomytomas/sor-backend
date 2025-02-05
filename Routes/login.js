"use strict";
import express from "express";
import jwt from "jsonwebtoken";


const router = express.Router();

router.get("/", (req, res) => {
  console.log("🔑 SECRET_KEY:", process.env.SECRET_KEY);
  res.render("login");
});

router.get("/refreshAdmin", async (req, res) => {
  const user = "santiago_lucas10@hotmail.com";
  
  const jwtt = jwt.sign({ bearer: user }, process.env.SECRET_KEY, { expiresIn: "1h" });

  res.json({ jwtAdmin: jwtt });
});

router.get("/logout", (req, res) => {
  console.log("entre????")
  res.status(200).json({ message: "Logout exitoso" });
});

router.post("/", async (req, res) => {
  console.log("entre????");
  const { mail, pass } = req.body;
  console.log(mail, pass);

  //const row = await getUser(mail);
  //if (!row.length) {
  //  return res.status(400).json({ message: "Usuario incorrecto" });
  //}

  //if (await compare(pass, row[0].user_pass)) {
  //  console.log(pass, row[0].user_pass);
    const user = {
     // _id: row[0].user_id,
    // name: row[0].user_name,
      mail: mail,
    };
    
    console.log(process.env.SECRET_KEY);
    // Generar JWT según el tipo de usuario
    const jwtt = jwt.sign({ bearer: user }, process.env.SECRET_KEY, { expiresIn: "1h" });

    if (mail === "santiago_lucas10@hotmail.com" && pass == "12345678") {
      return res.json({ jwtAdmin: jwtt });
    } else {
      return res.status(400).json({ message: "Usuario o Contraseña incorrecta" });
    }
 // } else {
  //  
 // }
});

export default router;
