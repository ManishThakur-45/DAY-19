
 const express = require('express');
 const authController = require("../controllers/auth.controllers")

const authRoutes = express.Router();

authRoutes.post('/register',authController.registerControlller)

authRoutes.post("/login",authController.loginController)

module.exports = authRoutes
