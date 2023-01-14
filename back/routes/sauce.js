// ---- Import d'Express ---- //
const express = require("express");

// ---- Fonction Router ---- //
const router = express.Router();

// ---- Import du middleware d'authentification ---- //
const auth = require("../middleware/auth");

// ---- Import du middleware Multer ---- //
const multer = require("../middleware/multer-config");

// ---- Import du controller sauces.js ---- //
const sauceCtrl = require("../controllers/sauces");

// ---- Endpoint GET, POST, PUT, DELETE, POST ---- //
router.get("/", auth, sauceCtrl.getAllSauces);
router.post("/", auth, multer, sauceCtrl.createSauce);
router.get("/:id", auth, sauceCtrl.getOneSauce);
router.put("/:id", auth, multer, sauceCtrl.modifySauce);
router.delete("/:id", auth, sauceCtrl.deleteSauce);
router.post("/:id/like", auth, sauceCtrl.likeSauce);

// ---- Export du module ---- //
module.exports = router;
