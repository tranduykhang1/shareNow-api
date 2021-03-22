const router = require('express').Router()

const { verifyJwt } = require("../../Config/jwt.js");
const messageRoom = require("./MessageRoom.controller")


router.post('/create', verifyJwt, messageRoom.createRoom)
router.post('/new-message', verifyJwt, messageRoom.newMessageRoom)
router.delete('/delete-message', verifyJwt, messageRoom.deleteMessageRoom)
router.get('/members', verifyJwt, messageRoom.getRoomMembers)


module.exports = router
