"use strict";
import express from "express";
import { compare } from "../util/passSegured.js";
import jwt from "jsonwebtoken";
import {getUser} from "../Models/mdlUsers.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.render("login");
});

router.get("/refreshAdmin", async (req, res) => {
  const user = "santiago_lucas10@hotmail.com";
  
  console.log(req.session.user);
  const jwtt = jwt.sign({ bearer: user }, process.env.JWT_SECRET, { expiresIn: "1h" });

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
    

    // Generar JWT según el tipo de usuario
    const jwtt = jwt.sign({ bearer: user }, process.env.JWT_SECRET, { expiresIn: "1h" });

    if (mail === "santiago_lucas10@hotmail.com" && pass == "12345678") {
      return res.json({ jwtAdmin: jwtt });
    } else {
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }
 // } else {
  //  
 // }
});

export default router;
