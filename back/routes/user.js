// ---- Import d'Express ---- //
const express = require("express");

// ---- Fonction Router ---- //
const router = express.Router();

// ---- Import du controller user.js ---- //
const userCtrl = require("../controllers/user");

//---- Import du Middleware email.js ---- //

const email = require("../middleware/email");

const password = require("../middleware/password");

// ---- Endpoint SignUp & Login  ---- //
router.post("/signup", email, password, userCtrl.signup);
router.post("/login", userCtrl.login);

// ---- Export du module ---- //
module.exports = router;
