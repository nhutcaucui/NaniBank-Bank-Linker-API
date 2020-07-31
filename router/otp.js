var express = require('express');
var router = express.Router();
const axios = require('axios').default;
const config = require('config');
const mail_host = config.get('mail-host');
const userMiddleware = require('../middleware/userValidate');
const createOtp = require('../middleware/otpValidate').createOtp;
const customer = require('../model/customers/customer');
const hotp = require('otplib').hotp;
const authenticator = require('otplib').authenticator;
const moment = require('moment');

router.get('/create', [userMiddleware], async function(req, res) {
    let access_token = req.headers["access-token"];
    let pack = createOtp(access_token);
    let id = req.query["customer_id"];

    if (id == undefined) {
        res.status(200).send({
            "Status" : false,
            "Message" : "customer_id param is missing"
        });
        return;
    }

    let result = await customer.getById(id);
    if (result instanceof Error) {
        res.status(200).send({
            "Status" : false,
            "Message" : result.message
        });
    }

    let info = result.info;

    axios.post(`http://${mail_host}/mail/otp`, {
        email: info.email,
        name : info.name,
        otp : pack.otp
    });

    // mail(info, pack.otp);
    //send mail
    res.status(200).send({
        "Status" : true,
        "Message" : "Create otp successfully",
        "Otp" : pack.otp,
        "Key" : pack.key
    });
});

router.get('/s-create', async function(req, res) {
    let username = req.query["username"];
    if (username == undefined) {
        res.status(200).send({
            "Status" : false,
            "Message" : "username param is missing"
        });
        return;
    }
    let result = await customer.login(username, "", false);
    if (result instanceof Error) {
        res.status(200).send({
            "Status" : false,
            "Message" : result.message
        });
        return;
    }
    let access_token = result.token;
    let pack = createOtp(access_token);

    result = await customer.getByName(username);

    if (result instanceof Error) {
        res.status(200).send({
            "Status" : false,
            "Message" : result.message
        });
        return;
    }
    let info = result.info;
    axios.post(`http://${mail_host}/mail/otp`, {
        email: info.email,
        name : info.name,
        otp : pack.otp
    });

    res.status(200).send({
        "Status" : true,
        "Message" : "Create otp successfully",
        "Otp" : pack.otp,
        "Key" : pack.key,
        "Access Token" : access_token
    });
});

router.get('/ping', function(req, res) {
    res.status(200).send("ping");
})

router.post('/check', [userMiddleware], function (req, res, next) {
    let access_token = req.headers["access-token"];
    let key = req.headers["key"];
    let otp = req.headers["otp"];
    
    if (access_token == undefined) {
        res.status(200).send({
            "Status" : false,
            "Message" : "access-token header is missing"
        });
    }
    if (otp == undefined) {
        res.status(200).send({
            "Status" : false,
            "Message" : "otp header is missing"
        });
        return;
    }

    if (key == undefined) {
        res.status(200).send({
            "Status" : false,
            "Message" : "key header is missing"
        });

        return;
    }
    key = Number(key);
    if (moment().unix() - key > 60) {
        res.status(200).send({
            "Status" : false,
            "Message" : "OTP is expired"
        });
        return;
    }

    if (!hotp.check(otp, access_token, key)) {
        res.status(200).send({
            "Status" : false,
            "Message" : "Invalid OTP"
        });
        return;
    }

    res.status(200).send({
        "Status" : true,
        "Message" : "Invalid OTP"
    });
})

module.exports = router;