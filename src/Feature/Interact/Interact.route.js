const router = require("express").Router();
const { verifyJwt } = require("../../Config/jwt.js");

const interactiveController = require("./Interact.controller");

router.post("/comment", verifyJwt, interactiveController.createComment);
router.delete("/comment", verifyJwt, interactiveController.deleteComment);
router.put("/comment", verifyJwt, interactiveController.editComment);
router.get("/like", verifyJwt, interactiveController.likePost);
router.delete("/like", verifyJwt, interactiveController.unLikePost);
router.get("/comment/:postId", verifyJwt, interactiveController.getComment);

router.post(
    "/comment-group",
    verifyJwt,
    interactiveController.commentPostInGroup
);
router.get(
    "/comment-group/:post_id",
    verifyJwt,
    interactiveController.getCommentInGroup
);

router.get("/like-group/:post_id", verifyJwt, interactiveController.likePostInGroup);
router.delete(
    "/like-group",
    verifyJwt,
    interactiveController.unLikePostInGroup
);

module.exports = router;