// Export de la fonction du middleware

module.exports = (req, res, next) => {
  const validEmail = (email) => {
    // Déclaration de la variable qui contient la REGEX
    let emailRegexp = /^\S+@\S+.\S+$/;
    // Déclaration de la variable qui contient la méthode test
    let isRegexTrue = emailRegexp.test(email);
    isRegexTrue
      ? // Si la valeur de isRegexTrue est True
        next()
      : res.status(400).json({
          message: "Veuillez entrez un email correct. ( example@gmail.com )",
        });
  };
  validEmail(req.body.email);
};
