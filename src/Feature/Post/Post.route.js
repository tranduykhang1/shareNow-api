const router = require("express").Router();
const { verifyJwt } = require("../../Config/jwt.js");

const postController = require("./Post.controller");


router.post("/create", verifyJwt, postController.createPost);
router.put("/update", verifyJwt, postController.updatePost);
router.delete("/delete", verifyJwt, postController.deletePost);
router.get("/user/:id", verifyJwt, postController.getUsersPost);
router.get("/filter/", verifyJwt, postController.filterPost);
router.get("/page/:page", verifyJwt, postController.allOfPosts);
router.get("/photo", verifyJwt, postController.getPhotoByUser)
module.exports = router;