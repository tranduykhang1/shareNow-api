const nodemailer = require("nodemailer");
const { signJwt } = require("../Config/jwt.js");

exports.handleMailer = (user, isForgot, cb) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "sep31700215@gmail.com",
            pass: "photosharing2",
        },
    });
    let mailOptions;
    if (!isForgot) {
        mailOptions = {
            from: "sep31700215@gmail.com",
            subject: "Confirm your Email",
            to: user.email,
            html: `<div><h3>Confirm your email to finish</h3>${signJwt(
                user
            )}</div>`,
        };
    } else {
        mailOptions = {
            from: "sep31700215@gmail.com",
            subject: "Reset Password",
            to: user,
            html: `<div><h3>Confirm your email to get new password</h3>${signJwt(
                user
            )}</div>`,
        };
    }

    transporter.sendMail(mailOptions, (err, rs) => {
        if (rs) {
            return cb(null, rs);
        }
        return cb(err, null);
    });
};
