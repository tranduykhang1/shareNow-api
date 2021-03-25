const router = require('express').Router();
const { verifyJwt } = require("../../Config/jwt.js");

const interactiveController = require('./Interact.controller');

router.post('/comment', verifyJwt,  interactiveController.createComment)
router.delete('/comment', verifyJwt,  interactiveController.deleteComment)
router.put('/comment', verifyJwt,  interactiveController.editComment)
router.get('/like', verifyJwt,  interactiveController.likePost)
router.delete('/like', verifyJwt,  interactiveController.unLikePost)


module.exports = router
