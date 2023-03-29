// ---- Import de Multer ---- //
const multer = require("multer");

// -- Listes de MIME Types -- //
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

// -- Destination du fichier et génértion de son nom unique -- //
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    const name = file.originalname
      .substring(0, file.originalname.lastIndexOf("."))
      // part de l'index 0 du nom de fichier jusqu'au "." et delete le pts et l'extension.
      .split(" ")
      .join("_");
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + "." + extension);
  },
});

// ---- Export du middleware Multer ---- //
module.exports = multer({ storage: storage }).single("image");
