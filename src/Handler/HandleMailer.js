const nodemailer = require("nodemailer");
const { signJwt } = require("../Config/jwt.js");
const {confirmEmailTemplate} =require("./SendMailTemplate")

exports.handleMailer = (user, isForgot, cb) => {
    let mailToken = signJwt(user);
    mailToken = mailToken.token;

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
            subject: "Xác nhận Email",
            to: user.email,
            html: confirmEmailTemplate(mailToken),
        };
    } else {
        mailOptions = {
            from: "sep31700215@gmail.com",
            subject: "Cập nhật mật khẩu mới.",
            to: user,
            html: confirmEmailTemplate(mailToken),
        };
    }

    transporter.sendMail(mailOptions, (err, rs) => {
        if (rs) {
            return cb(null, rs);
        }
        return cb(err, null);
    });
};
