const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')

const generateToken = email => {
    let mailToken = jwt.sign({ email }, 'Hello', {
        expiresIn: "5m"
    });
    return mailToken;

};

exports.handleMailer = (email, cb) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "sep31700215@gmail.com",
            pass: "photosharing2"
        }
    });
    var mailOptions = {
        from: "sep31700215@gmail.com",
        subject: "Confirm your Email",
        to: email,
        html: `<div><h3>Confirm your email</h3><a href=${generateToken(email)}>Click here</a></div>`
    };
    transporter.sendMail(mailOptions, (err, rs) => {
        if (rs) {
            return cb(null, rs);
        }
        return cb(err, null);
    });
};
