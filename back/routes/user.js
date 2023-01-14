// ---- Import d'Express ---- //
const express = require("express");

// ---- Fonction Router ---- //
const router = express.Router();

// ---- Import du controller user.js ---- //
const userCtrl = require("../controllers/user");

// ---- Endpoint SignUp & Login  ---- //
router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);

// ---- Export du module ---- //
module.exports = router;
