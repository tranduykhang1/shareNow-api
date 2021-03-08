const userModel = require('./Auth.model.js')



module.exports = {
    login(req, res) {
        userModel.loginModel(req.body, (err, result) => {
            if (err) res.json(err)
            res.json(result)
        })
    },
    register(req, res) {
        const userSchema = {
            email: req.body.email,
            password: req.body.password,
            full_name: req.body.full_name
        }
        userModel.registerModel(userSchema, (err, result) => {
            if (err) res.json(err)
            res.json(result)
        })
    },
    confirmEmail(req, res) {},
    forgotPassword(req, res) {},
    updatePassword(req, res) {}
}