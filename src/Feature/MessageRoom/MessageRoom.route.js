const router = require('express').Router()

const { verifyJwt } = require("../../Config/jwt.js");
const messageRoom = require("./MessageRoom.controller")


router.post('/create', verifyJwt, messageRoom.createRoom)
router.post('/new-message', verifyJwt, messageRoom.newMessageRoom)
router.delete('/delete-message', verifyJwt, messageRoom.deleteMessageRoom)
router.get('/members', verifyJwt, messageRoom.getRoomMembers)
router.get('/join', verifyJwt, messageRoom.joinRoom)
router.delete('/leave', verifyJwt, messageRoom.leaveRoom)
router.delete('/destroy', verifyJwt, messageRoom.destroyRoom)


module.exports = router
