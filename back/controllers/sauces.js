// ---- Import du model de la DB ---- //
const Sauce = require("../models/sauce");

// ---- Import du module File Systeme ---- //
const fs = require("fs");

// ---- Export du controller createSauce ---- //
exports.createSauce = (req, res, next) => {
  const thingObject = JSON.parse(req.body.sauce);
  delete thingObject._id;

  // -- Création d'une sauce -- //
  const sauce = new Sauce({
    ...thingObject,
    // -- Création de l'URL de l'image -- //
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });

  // -- Envoi de l'objet à la DB -- //
  sauce
    .save()
    .then(() => res.status(201).json({ message: "Objet enregistré !" }))
    .catch((error) => res.status(400).json({ error }));
};

// ---- Export du controller getOneSauce ---- //
exports.getOneSauce = (req, res, next) => {
  // -- Lecture d'une sauce via son ID -- //
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      res.status(200).json(sauce);
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
};

// ---- Export du controller modifySauce ---- //
exports.modifySauce = (req, res, next) => {
  // -- Bloc de modification de l'objet supprimant l'ancienne image apres update du user -- //
  Sauce.findOne({ _id: req.params.id }).then((sauce) => {
    const filename = sauce.imageUrl.split("/images/")[1];
    fs.unlink(`images/${filename}`, () => {
      const thingObject = req.file
        ? {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get("host")}/images/${
              req.file.filename
            }`,
          }
        : { ...req.body };
      // -- Modification dans la DB -- //
      Sauce.updateOne(
        { _id: req.params.id },
        { ...thingObject, _id: req.params.id }
      )
        .then(() => res.status(200).json({ message: "Objet modifié !" }))
        .catch((error) => res.status(400).json({ error }));
    });
  });
};

// ---- Export du controller deleteSauce ---- //
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Objet supprimé !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

// ---- Export du controller getAllSauce ---- //
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((things) => {
      res.status(200).json(things);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

// ---- Partie Like / Dislike ---- //

// ---- Export du controller likeSauce ---- //
// -- L'utilisateur like ou dislike une sauce -- //
exports.likeSauce = (req, res, next) => {
  const sauceId = req.params.id;
  const userId = req.body.userId;
  const like = req.body.like;
  // -- Si l'utilisateur met pour la premiere fois un like (like === 1) -- //
  if (like === 1) {
    Sauce.updateOne(
      { _id: sauceId },
      {
        $inc: { likes: like },
        $push: { usersLiked: userId },
      }
    )
      .then((sauce) => res.status(200).json({ message: "L'utilisateur Like" }))
      .catch((error) => res.status(500).json({ error }));
  }

  // Si l'utilisateur met pour la premiere fois un dislike (like === -1) -- //
  else if (like === -1) {
    Sauce.updateOne(
      { _id: sauceId },
      {
        $inc: { dislikes: -1 * like },
        $push: { usersDisliked: userId },
      }
    )
      .then((sauce) =>
        res.status(200).json({ message: "L'utilisateur Dislike" })
      )
      .catch((error) => res.status(500).json({ error }));
  }
  // ---- Les changements d'avis de l'utilisateur : ---- //
  // -- L'utilisateur change d'avis sur son like -- //
  else {
    Sauce.findOne({ _id: sauceId })
      .then((sauce) => {
        if (sauce.usersLiked.includes(userId)) {
          Sauce.updateOne(
            { _id: sauceId },
            { $pull: { usersLiked: userId }, $inc: { likes: -1 } }
          )
            .then((sauce) => {
              res
                .status(200)
                .json({ message: "L'utilisateur annule son Like" });
            })
            .catch((error) => res.status(500).json({ error }));
          // -- L'utilisateur change d'avis sur son dislike -- //
        } else if (sauce.usersDisliked.includes(userId)) {
          Sauce.updateOne(
            { _id: sauceId },
            {
              $pull: { usersDisliked: userId },
              $inc: { dislikes: -1 },
            }
          )
            .then((sauce) => {
              res
                .status(200)
                .json({ message: "L'utilisateur annule son Dislike" });
            })
            .catch((error) => res.status(500).json({ error }));
        }
      })
      .catch((error) => res.status(401).json({ error }));
  }
};
