const hotp = require('otplib').hotp;
const authenticator = require('otplib').authenticator;
const moment = require('moment');

function createOtp(key) {
    let now = moment().unix();
    let past = now - 30;

    // let counter = Math.floor(Math.random() * 10);
    counter = past;
    let otp = hotp.generate(key, counter);
    return {otp: otp, key: counter};
}

function otpValidate(req, res, next) {
    let access_token = req.headers["access-token"];
    let key = req.headers["key"];
    let otp = req.headers["otp"];
    
    if (access_token == undefined) {
        res.status(401).send({
            "Status" : false,
            "Message" : "access-token header is missing"
        });
    }
    if (otp == undefined) {
        res.status(401).send({
            "Status" : false,
            "Message" : "otp header is missing"
        });
        return;
    }

    if (key == undefined) {
        res.status(401).send({
            "Status" : false,
            "Message" : "key header is missing"
        });

        return;
    }
    key = Number(key);
    if (moment().unix() - key > 60) {
        res.status(401).send({
            "Status" : false,
            "Message" : "OTP is expired"
        });
        return;
    }

    if (!hotp.check(otp, access_token, key)) {
        res.status(401).send({
            "Status" : false,
            "Message" : "Invalid OTP"
        });
        return;
    }

    next();
}

module.exports = {
    otpValidate,
    createOtp
}