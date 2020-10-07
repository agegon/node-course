const multer = require('multer');

const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, 'images');
  },
  filename(req, file, callback) {
    callback(null, `${Date.now()}_${file.originalname}`);
  },
});

const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg'];

const fileFilter = (req, file, callback) => {
  if (ALLOWED_TYPES.includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(null, false);
  }
}

module.exports = multer({
  fileFilter,
  storage,
});
