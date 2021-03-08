const express = require('express')
const route = express.Router();

const authController = require('./Auth.controller.js')

route.post('/login', authController.login)
route.post('/register', authController.register)
route.post('/confirm-email', authController.confirmEmail)
route.post('/forgot-passowrd', authController.forgotPassword)
route.post('/update-password', authController.updatePassword)


module.exports = route;
