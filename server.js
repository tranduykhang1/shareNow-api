const express = require('express')
const bodyParser = require('body-parser')
const cookieSession = require("cookie-session");
const app = express()

app.use(
	cookieSession({
	   maxAge: 30 * 24 * 60 * 60 * 1000,
      keys: ["key1", "key2"]
	})
);


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


const Auth = require('./src/Feature/Auth/Auth.router.js')
const User = require('./src/Feature/User/User.route.js')


app.use('/auth', Auth)
app.use('/user', User)


app.listen(process.env.PORT || 1234);
