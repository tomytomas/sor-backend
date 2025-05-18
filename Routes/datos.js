"use strict";
const express = require("express");
const router = express.Router();
const mdlUsers = require("../Models/mdlUsers");


// Endpoint GET para obtener todas las ofertas
router.get("/users", async (req, res) => {
  try {
    const users = await mdlUsers.getAllUsers();

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error while retrieving users" });
  }
});



module.exports = router;
