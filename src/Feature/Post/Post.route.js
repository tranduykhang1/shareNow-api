const router = require("express").Router();

const { verifyJwt } = require("../../Config/jwt.js");

const postController = require("./Post.controller");
//const { multerArray } = require("../../Config/multer.config");

router.post("/create", verifyJwt, postController.createPost);
router.put("/update", verifyJwt, postController.updatePost);
router.delete("/delete", verifyJwt, postController.deletePost);
router.get("/", verifyJwt, postController.getUsersPost);
router.get("/by-topic/", verifyJwt, postController.getPostByTopic);
router.get("/by-tag/", verifyJwt, postController.getPostByTag);
router.get("/page/:page", verifyJwt, postController.getAllOfPosts);


module.exports = router;
