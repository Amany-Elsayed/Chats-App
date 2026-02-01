const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/audio");
  },
  filename: (req, file, cb) => {
    const AAA = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, AAA + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("audio")) cb(null, true);
  else cb(new Error("Only audio files allowed"), false);
};

const uploadAudio = multer({ storage, fileFilter });

module.exports = uploadAudio;
