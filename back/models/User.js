// ---- Import de mongoose ---- //
const mongoose = require("mongoose");

// ---- Import de mongoose-unique-validator ---- //
const uniqueValidator = require("mongoose-unique-validator");

// -- Modèle de la DB lors de l'inscription (signup)
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// -- Contrôle que l'email soit unique avec mongoose-unique-validator -- //
userSchema.plugin(uniqueValidator);

// ---- Export du module ---- //
module.exports = mongoose.model("User", userSchema);
