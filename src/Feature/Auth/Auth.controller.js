const bcrypt = require("bcrypt");
const salt = 10; 
const authModel = require("./Auth.model.js");
const userSchema = require("../../Schema/Users.js");
const { handleMailer } = require("../../Handler/handleMailer.js");


let globalEmail = "";
class Auth {
    login(req, res) {
        authModel.loginModel(req.body, (err, result) => {
            if (err) res.json(err);
            res.json(result);
        });
    }
    async register(req, res) {
        const passwordHash = await bcrypt.hash(req.body.password, salt);
        const user = {
            email: req.body.email,
            password: passwordHash,
            full_name: req.body.full_name,
        };
        authModel.registerModel(user, (err, result) => {
            if (err) res.json(err);
            res.json(result);
        });
    }
    confirmEmail(req, res) {
        if (req.user.password) {
            userSchema.email = req.user.email;
            userSchema.password = req.user.password;
            userSchema.fullname = req.user.full_name;
            authModel.modifyUserModel(userSchema, (err, result) => {
                if (err) res.json(err);
                else {
                    return res.json(result);
                }
            });
        } else {
            globalEmail = req.user;
            return res.status(200).json("Redirect to other page");
        }
    }
    forgotPassword(req, res) {
        const email = req.body.email;
        handleMailer(email, true, (err, result) => {
            if (result) return res.status(200).json("Check your email!");
            return res.json(err);
        });
    }
    updatePassword(req, res) {
        let user = {};
        if (req.user) {
            user = {
                newPassword: req.body.new_password,
                email: req.user.email,
            };
        } else {
            user = {
                newPassword: req.body.new_password,
                email:globalEmail ,
            };
        }

        authModel.updatePasswordModel(user, (err, result) => {
            if (err) return res.status(403).json(err);
            else return res.status(200).json(result);
        });
    }
};


module.exports = new Auth()
