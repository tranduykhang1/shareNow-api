const bcrypt = require("bcrypt");
const { ObjectID } = require("mongodb");

const jwt = require("jsonwebtoken");
const config = require("../../Env/jwtSecret");

const { handleMailer } = require("../../Handler/handleMailer.js");
const conn = require("../../Connection/ConnectDB.js");
const { signJwt, verifyRefreshToken } = require("../../Config/jwt.js");
class authModel {
    constructor() {
        conn.then((db) => {
            const userDB = db.collection("user");
            const jwtDB = db.collection("refresh_token");
            this.userDB = userDB;
            this.jwtDB = jwtDB;
            this._id = "60a3351aa3b0ade8f1217e2c";
        });
    }
    loginModel(userModel, cb) {
        this.userDB.findOne({ email: userModel.email }, async (err, res) => {
            if (!res) {
                return cb(null, "Email not Found");
            } else {
                bcrypt.compare(
                    userModel.password,
                    res.password,
                    async (err, isMatch) => {
                        if (!isMatch) {
                            return cb(null, "Password incorrect");
                        } else {
                            if (!res.state.locked) {
                                const jwtToken = await signJwt(res);
                                this.jwtDB.updateOne(
                                    { _id: ObjectID(this._id) },
                                    {
                                        $push: {
                                            refresh_token:
                                                jwtToken.refreshToken,
                                        },
                                    }
                                );
                                return cb(jwtToken);
                            }
                            return cb(null, "Account was locked!");
                        }
                    }
                );
            }
        });
    }
    checkRefreshToken(token, cb) {
        this.jwtDB
            .aggregate([{ $match: { refresh_token: token } }])
            .toArray()
            .then(async (isToken) => {
                if (isToken.length > 0) {
                    try {
                        let decode = await verifyRefreshToken(token);
                        let accessToken = jwt.sign(
                            { data: decode },
                            config.jwtSecret,
                            {
                                expiresIn: "1h",
                            }
                        );
                        return cb(null, accessToken);
                    } catch (err) {
                        return cb(null, "Invalid signature");
                    }
                } else {
                    return cb(null, "Refresh token not found");
                }
            })
            .catch((err) => cb(new Error(err)));
    }
    googleLoginModel(data, cb) {
        this.userDB.findOne({ email: data.email }).then((user) => {
            if (user.length) {
                console.log('create')
                let jwtToken = signJwt(user);
                return cb(null,jwtToken);
            } else {
                this.userDB
                    .insertOne(data)
                    .then((res) => {
                        let jwtToken = signJwt(user);
                        return cb(null,jwtToken);
                    })
                    .catch((err) => cb(err));
            }
        });
    }
    registerModel(user, cb) {
        this.userDB.findOne({ email: user.email }, (err, res) => {
            if (res) cb("Email have already");
            else {
                handleMailer(user, false, (err, result) => {
                    if (result) return cb("Check your email!");
                    return cb(err);
                });
            }
        });
    }
    checkUser(email, cb) {
        this.userDB.findOne({ email: email }, (err, res) => {
            if (err) return cb(new Error(err));
            if (res) return cb(null, false);
            if (!res) return cb(null, true);
        });
    }
    modifyUserModel(userSchema, cb) {
        this.userDB.findOne({ email: userSchema.email }, (err, result) => {
            if (result) {
                return cb(null, "Account is active!");
            } else {
                this.userDB.insertOne(userSchema, (err, result) => {
                    if (err) return cb(new Error(err));
                    else {
                        return cb(null, "Register success!");
                    }
                });
            }
        });
    }
    updatePasswordModel(userModel, cb) {
        conn.then(async (db) => {
            const hashPassword = await bcrypt.hash(userModel.newPassword, 10);
            this.userDB.updateOne(
                { email: userModel.email },
                { $set: { password: hashPassword } },
                (err, result) => {
                    if (err) return cb(err);
                    else {
                        return cb(null, "Password update success!");
                    }
                }
            );
        });
    }
}

module.exports = new authModel();
