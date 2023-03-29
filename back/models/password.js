const passwordValidator = require("password-validator");

// Création du schéma
const passwordSchema = new passwordValidator();

// Ajout des propriétés
passwordSchema
  .is()
  .min(5)
  .is()
  .max(64)
  .has()
  .uppercase()
  .has()
  .lowercase()
  .has()
  .digits()
  .has()
  .not()
  .spaces();

// Export du module
module.exports = passwordSchema;
