const router = require("express").Router();

const { verifyJwt } = require("../../Config/jwt.js");

const postController = require("./Post.controller");
//const { multerArray } = require("../../Config/multer.config");

router.post("/create", verifyJwt, postController.createPost);
router.put("/update", verifyJwt, postController.updatePost);
router.delete("/delete", verifyJwt, postController.deletePost);

module.exports = router;
