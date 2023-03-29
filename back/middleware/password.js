// Import du model password
const passwordSchema = require("../models/password");

// Export de la fonction du middleware
module.exports = (req, res, next) => {
  // Si le mdp ne respecte pas le schéma
  if (!passwordSchema.validate(req.body.password)) {
    res.status(400).json({
      message:
        "Le MDP doit contenir au moins 5 caractères dont une majuscule, une minuscule et un chiffre minimum.",
    });
  } else {
    next();
  }
};
