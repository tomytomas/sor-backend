"use strict";
const pool = require("../db");
const express = require("express");
const router = express.Router();
const { encrypt } = require("../util/passSegured");
const jwt = require("jsonwebtoken");
const regUser = require("../Models/registerUser");
const { body, validationResult } = require('express-validator');
const mdlUsers = require("../Models/mdlUsers");


function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

router.post("/",
  [
    body("firstName").notEmpty().withMessage("El nombre es obligatorio"),
    body("lastName").notEmpty().withMessage("El apellido es obligatorio"),
    body("mail").isEmail().withMessage("Email no válido"),
    body("pass").isLength({ min: 6 }).withMessage("La contraseña debe tener al menos 6 caracteres")
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, mail, pass } = req.body;

      const existingUser = await mdlUsers.getUser(mail);
      if (existingUser) {
        return res.status(400).json({ message: "Email ya utilizado" });
      }

      const hash = await encrypt(pass);
      const data = await regUser.addData(firstName, lastName, mail, hash);

      if (data) {
          // Generando código de verificación y expiración
          const code = generateCode();
          const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

          await pool.query(`
            UPDATE users
            SET email_verification_code = $1,
                verification_expires_at = $2
            WHERE mail = $3
          `, [code, expiresAt, mail]);

          // Enviamos el correo de verificación
          
          return res.status(200).json({ message: "User registered. Verify your email to continue" });
        } else {
          res.status(500).json({ message: "Error to instert user" });
        }
      }
  );
    
  router.post("/firststep", async (req, res) => {
    console.log("firststep");
    const { ubication, state , zipCode, mail } = req.body;
    console.log(ubication, zipCode, mail, state);

    const data = await regUser.addDataFirstStep(ubication, state, zipCode, mail);
  
    if (data.rowCount > 0) {
      res.sendStatus(200);
    } else {
      res.status(400).json({ message: "No se pudo actualizar el usuario" });
    }
  });

  router.post("/secondstep", async (req, res) => {
    console.log("secondstep");
    const { salary, paymentPeriod, mail} = req.body;
    console.log(salary, paymentPeriod, mail);
    const data = await regUser.addDataSecondStep(salary, paymentPeriod, mail);
    if (data.rowCount > 0) {
      res.sendStatus(200);
    } else {
      res.status(400).json({ message: "No se pudo actualizar el usuario" });
    }
  });
    module.exports = router;
  
   