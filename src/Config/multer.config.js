//using express-fileUpload 
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const multerSingle = upload.single("photo");
const multerArray = upload.array("photos", 6);

module.exports = { multerArray, multerSingle };
