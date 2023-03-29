// ---- Import de JsonWebToken ---- //
const jwt = require("jsonwebtoken");

// ---- Export de la fonction du middleware ---- //
module.exports = (req, res, next) => {
  try {
    // -- Récupération du Token dans le headers authorization -- //
    const token = req.headers.authorization.split(" ")[1];

    // -- Déchiffrage du Token -- //
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");

    // -- Récupération du userId à l'intérieur du Token chiffré -- //
    const userId = decodedToken.userId;

    // -- Comparaison du userId de la requête avec celui du Token -- //
    if (req.body.userId && req.body.userId !== userId) {
      throw "Invalid user ID";
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error("Invalid request!"),
    });
  }
};
