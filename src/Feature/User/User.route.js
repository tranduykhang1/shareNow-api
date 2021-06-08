const express = require('express')
const router = express.Router()

const userAuth = require('./User.controller')
const { verifyJwt } = require('../../Config/jwt')
    //const {multerSingle} = require('../../Config/multer.config.js')


router.get('/profile/', verifyJwt, userAuth.getProfile)
router.put('/profile', verifyJwt, userAuth.updateProfile)
router.put('/avatar', verifyJwt, userAuth.updateAvatar)
router.put('/background', verifyJwt, userAuth.updateBackground)
router.get('/follow', verifyJwt, userAuth.followUser)
router.get('/list-following', verifyJwt, userAuth.listFollowing)
router.put('/active', verifyJwt, userAuth.confirmUser)
router.get('/total-user', verifyJwt, userAuth.getTotalUser)
router.get('/related-user', verifyJwt, userAuth.getUserRelated)


module.exports = router;