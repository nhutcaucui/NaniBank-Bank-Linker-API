var express = require('express');
var router = express.Router();
const userMiddleware = require('../middleware/userValidate');
const createOtp = require('../middleware/otpValidate').createOtp;

router.get('/create', [userMiddleware], function(req, res) {
    let access_token = req.headers["access-token"];
    let pack = createOtp(access_token);
    //send mail
    res.status(200).send({
        "Status" : true,
        "Message" : "Create otp successfully",
        "Otp" : pack.otp,
        "Key" : pack.key
    });
});

router.get('/ping', function(req, res) {
    res.status(200).send("ping");
})

module.exports = router;