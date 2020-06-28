const multer = require('multer');
const path = require('path');

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
};

const fileFilter = (res, file, cb) => {
  const isValid = MIME_TYPE_MAP[file.mimetype];
  if (isValid) {
    cb(null, true);
  } else {
    cb(
      new Error(
        'Solo se admiten imagenes con extensión .JPEG, JPG y PNG.',
        400
      ),
      false
    );
  }
};

const storage = multer.diskStorage({
  destination: 'uploads',
  filename: (req, file, cb) => {
    cb(null, new Date().getTime() + path.extname(file.originalname));
  },
});

module.exports = multer({
  storage,
  fileFilter,
});
