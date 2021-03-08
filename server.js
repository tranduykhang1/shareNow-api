const express = require('express')
const bodyParser = require('body-parser')
const app = express()


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



const Auth = require('./src/Feature/Auth/Auth.router.js')
app.use('/', Auth)

const user = require('hello')

app.listen(process.env.PORT || 1234);