"use strict";
const express = require("express");
const comparar = require("../util/passSegured")
const { encrypt } = require("../util/passSegured");
const jwt = require("jsonwebtoken");
const router = express.Router();
const mdlUsers = require("../Models/mdlUsers");
const authenticateToken = require('../middleware/authenticationToken');

router.get("/refreshAdmin",async (req, res) => {

  const user="santiago_lucas10@hotmail.com"; 
 req.session.user
  const jwtt=jwt.sign({ bearer: user }, process.env.jwt_secret, { expiresIn: '1h' })
  res.json((200, {jwtAdmin: jwt}));
});

router.get("/logout", (req, res) => {
  // Si todavía usás sesiones para otra cosa, podés destruirlas:
  if (req.session) {
    req.session.destroy();
  }
  res.status(200).json({ message: "Sesión cerrada correctamente" });
});

router.post("/", async (req, res) => {
  try {
    const { mail, password } = req.body;
    console.log("mail", mail);
    console.log("password", password);
    
    const user = await mdlUsers.getUser(mail);
    console.log("user", user);
    const hash = await encrypt(password);
    console.log("pass", hash);

    const match = await comparar.compare(password, user.password);

    if (match) {
      const userData = {
        _id: user.id,
        name: user.name,
        mail: user.mail,
      };
      req.session.user = userData;

      const token = jwt.sign(
        { id: userData._id, mail: userData.mail },
        process.env.SECRET_KEY,
        { expiresIn: "1h" }
      );

      return res.status(200).json({ token , user: userData });
    } else {
      console.log("Contraseña incorrecta");
      return res.status(400).json({ message: "Incorrect password" });
    }
  } catch (error) {
    console.error("Error en login:", error);
    return res.status(500).json({ message: "Server error" });
  }
});


router.get('/name', authenticateToken, async (req, res) => {
  try {
    const userEmail = req.user.mail;
    const user = await mdlUsers.getUserProfileByEmail(userEmail);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      firstName: user.name,
      lastName: user.surname,
      email: user.mail,
      photo: user.photo
    });

  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

