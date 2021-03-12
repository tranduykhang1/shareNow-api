const express = require('express')
const router = express.Router()

const userAuth = require('./User.controller')
const {verifyJwt} = require('../../Config/jwt')
const {multerSingle} = require('../../Config/multer.config.js')


router.get('/profile', verifyJwt, userAuth.getProfile)
router.put('/update-profile', verifyJwt, userAuth.updateProfile)
router.put('/update-avatar', verifyJwt,multerSingle, userAuth.updateAvatar)
router.put('/update-background', verifyJwt,multerSingle, userAuth.updateBackground)
router.get('/follow', verifyJwt, userAuth.followUser)
router.get('/list-following', verifyJwt, userAuth.listFollowing)

module.exports = router;


