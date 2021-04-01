const bcrypt = require("bcrypt");

const { handleMailer } = require("../../Handler/handleMailer.js");
const conn = require("../../Connection/ConnectDB.js");
const { signJwt } = require("../../Config/jwt.js");
class authModel {
    loginModel(userModel, cb) {
        conn.then((db) => {
            const userDB = db.collection("user");
            userDB.findOne({ email: userModel.email }, async(err, res) => {
                if (!res) {
                    return cb(null, "Email not Found");
                } else {
                    bcrypt.compare(
                        userModel.password,
                        res.password,
                        (err, isMatch) => {
                            if (!isMatch) {
                                return cb(null, "Password incorrect!");
                            } else {
                                if (!res.state.locked) {
                                    const token = signJwt(res);
                                    return cb(token);
                                }
                                return cb(null, "Account was locked!");
                            }
                        }
                    );
                }
            });
        });
    }
    registerModel(user, cb) {
        conn.then((db) => {
            const userDB = db.collection("user");
            userDB.findOne({ email: user.email }, (err, res) => {
                if (res) cb("Email have already");
                else {
                    handleMailer(user, false, (err, result) => {
                        if (result) return cb("Check your email!");
                        return cb(err);
                    });
                }
            });
        });
    }
    modifyUserModel(userSchema, cb) {
        conn.then((db) => {
            const userDB = db.collection("user");
            userDB.findOne({ email: userSchema.email }, (err, result) => {
                if (result) {
                    return cb(null, "Account is active!");
                } else {
                    userDB.insertOne(userSchema, (err, result) => {
                        if (err) return cb(new Error(err));
                        else {
                            return cb(null, "Register success!");
                        }
                    });
                }
            });
        });
    }
    updatePasswordModel(userModel, cb) {
        console.log(userModel);
        conn.then(async(db) => {
            const userDB = db.collection("user");
            const hashPassword = await bcrypt.hash(userModel.newPassword, 10);
            userDB.updateOne({ email: userModel.email }, { $set: { password: hashPassword } },
                (err, result) => {
                    if (err) return cb(err);
                    else {
                        return cb(null, "Password update success!");
                    }
                }
            );
        });
    }
};


module.exports = new authModel();