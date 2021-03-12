const multer = require("multer");
const upload = multer({ dest: "./src/Upload/"});

module.exports.multerSingle = upload.single("photo");

