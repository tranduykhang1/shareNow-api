const express = require('express')
const route = express.Router();


const authController = require('./Auth.controller.js')
const {verifyJwt} = require('../../Config/jwt.js')

route.post('/login', authController.login)
route.post('/register', authController.register)
route.get('/confirm-email/', verifyJwt, authController.confirmEmail)
route.post('/forgot-password', authController.forgotPassword)
route.put('/update-password',verifyJwt, authController.updatePassword)


module.exports = route;
