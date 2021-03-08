const conn = require('../../Connection/ConnectDB.js')

const { handleMailer } = require('../../Handler/handleMailer.js')

module.exports = {
    loginModel(userModel, cb) {
        conn.then(db => {
            const userDB = db.collection('user')
            userDB.findOne({ email: userModel.email }, (err, res) => {
                if (err) {
                    return cb("Email have one")
                } else {
                    return cb("Not found")
                }
            })
        })
    },
    registerModel(userModel, cb) {
        conn.then(db => {
            const userDB = db.collection('user')
            userDB.findOne({ email: userModel.email }, (err, res) => {
                if (res) cb("Email have already")
                else {
                    handleMailer(userModel.email, (err, result) => {
                        if (result) return cb("Check your email!")
                        return cb(err)
                    })
                }
            })
        })
    },
    updatePassword(userModel, cb) {
    },
    resetPassword(email, cb) {

    }
}
