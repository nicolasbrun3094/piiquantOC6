// ---- Import de Bcrypt ---- //
const bcrypt = require("bcrypt");

// ---- Import de JsonWebToken ---- //
const jwt = require("jsonwebtoken");

// ---- Import du model User de la DB ---- //
const User = require("../models/User");

// ---- Enregistrement d'un nouvel utisateur dans la DB ---- //
exports.signup = (req, res, next) => {
  // -- Hash du MDP avant l'envoi à la DB -- //
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      // -- Enregistrement du nouvel utilisateur dans la DB -- //
      const user = new User({
        email: req.body.email,
        password: hash,
      });

      // -- Envoi du contenu à la DB -- //
      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

//---- Gestion de l'authentification ---- //
exports.login = (req, res, next) => {
  // -- Vérification de l'existence de l'utilisateur dans la DB -- //
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res
          .status(401)
          .json({
            error: "Utilisateur non trouvé ou Mot de passe incorrect  !",
          });
      }
      // -- Contrôle de la validité du MDP -- //
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          // -- Si non valide -- //
          if (!valid) {
            return res
              .status(401)
              .json({
                error: "Utilisateur non trouvé ou Mot de passe incorrect !",
              });
          }
          // -- Si MDP valide envoi de la réponse du serveur avec userId & token -- //
          res.status(200).json({
            userId: user._id,
            token: jwt.sign({ userId: user._id }, "RANDOM_TOKEN_SECRET", {
              expiresIn: "24h",
            }),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
