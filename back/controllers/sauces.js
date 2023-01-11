const Thing = require('../models/sauce');
const fs = require('fs');

exports.createThing = (req, res, next) => {
    const thingObject = JSON.parse(req.body.sauce);
    delete thingObject._id;
    const thing = new Thing({
      ...thingObject,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    thing.save()
      .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
      .catch(error => res.status(400).json({ error }));
  };

exports.getOneThing = (req, res, next) => {
  Thing.findOne({_id: req.params.id})
  .then((thing) => {res.status(200).json(thing);
  }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

exports.modifyThing = (req, res, next) => {
  // bloc supprimant l'ancienne image apres update du user
  Thing.findOne({ _id: req.params.id }).then((sauce) => {
    const filename = sauce.imageUrl.split("/images/")[1];
    fs.unlink(`images/${filename}`, () => {

    const thingObject = req.file ?
      {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      } : { ...req.body };
    Thing.updateOne({ _id: req.params.id }, { ...thingObject, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Objet modifié !'}))
      .catch(error => res.status(400).json({ error }));
    });
  });
};


  exports.deleteThing = (req, res, next) => {
    Thing.findOne({ _id: req.params.id })
      .then(thing => {
        const filename = thing.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Thing.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
            .catch(error => res.status(400).json({ error }));
        });
      })
      .catch(error => res.status(500).json({ error }));
  };

exports.getAllStuff = (req, res, next) => {
  Thing.find().then(
    (things) => {
      res.status(200).json(things);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};



//----------------------------------------------------->>
//-------------------partie Like/Dislike----------------------->>>>>
//----------------------------------------------------->>



// l'utilisateur like ou dislike une sauce
exports.likeSauce = (req, res, next) => {
  const sauceId = req.params.id;
  const userId = req.body.userId;
  const like = req.body.like;
  // l'utilisateur met pour la premiere fois un like (like === 1)
  if (like === 1) {
    Thing.updateOne(
      { _id: sauceId },
      {
        $inc: { likes: like },
        $push: { usersLiked: userId },
      }
    )
      .then((sauce) => res.status(200).json({ message: "L'utilisateur Like" }))
      .catch((error) => res.status(500).json({ error }));
  }

  // l'utilisateur met pour la premiere fois un dislike (like === -1)
  else if (like === -1) {
    Thing.updateOne(
      { _id: sauceId },
      {
        $inc: { dislikes: -1 * like },
        $push: { usersDisliked: userId },
      }
    )
      .then((sauce) => res.status(200).json({ message: "L'utilisateur Dislike" }))
      .catch((error) => res.status(500).json({ error }));
  }
  // les changements d'avis de l'utilisateur :
  // l'utilisateur change d'avis sur son like
  else {
    Thing.findOne({ _id: sauceId })
      .then((sauce) => {
        if (sauce.usersLiked.includes(userId)) {
          Thing.updateOne(
            { _id: sauceId },
            { $pull: { usersLiked: userId }, $inc: { likes: -1 } }
          )
            .then((sauce) => {
              res.status(200).json({ message: "L'utilisateur annule son Like" });
            })
            .catch((error) => res.status(500).json({ error }));
          // l'utilisateur change d'avis sur son dislike
        } else if (sauce.usersDisliked.includes(userId)) {
          Thing.updateOne(
            { _id: sauceId },
            {
              $pull: { usersDisliked: userId },
              $inc: { dislikes: -1 },
            }
          )
            .then((sauce) => {
              res.status(200).json({ message: "L'utilisateur annule son Dislike" });
            })
            .catch((error) => res.status(500).json({ error }));
        }
      })
      .catch((error) => res.status(401).json({ error }));
  }
};
