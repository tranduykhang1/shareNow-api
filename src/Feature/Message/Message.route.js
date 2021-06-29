const router = require('express').Router()
const { verifyJwt } = require("../../Config/jwt.js");
const messageController = require("./Message.controller");

router.post("/create", verifyJwt, messageController.createConversation)
router.post("/new", verifyJwt, messageController.newMessage)
router.delete("/delete", verifyJwt, messageController.deleteMessage)
router.get("/", verifyJwt, messageController.getMessage)
router.get("/message-list", verifyJwt, messageController.getMessageList)
router.delete("/delete-message", verifyJwt, messageController.deleteMessage)



module.exports = router