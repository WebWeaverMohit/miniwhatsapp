const multer = require('multer')
const crypto = require('crypto')
const path = require('path')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/images/uploads')
    },
    filename: function (req, file, cb) {
      const fn = crypto.randomBytes(16).toString('hex') + path.extname(file.originalname)
      cb(null, fn)
    }
  })

  const fileFilter = (req, file, cb) => {
    // File type validation
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type'), false);
    }
};
  
  const upload = multer({ storage, fileFilter })
  module.exports = upload