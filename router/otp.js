var express = require('express');
var router = express.Router();
const userMiddleware = require('../middleware/userValidate');
const createOtp = require('../middleware/otpValidate').createOtp;
router.get('/', [userMiddleware], function(req, res) {
    let access_token = req.headers["access_token"];
    let otp = createOtp(access_token);
    //send mail
    res.status(200).send({
        "Status" : true,
        "Message" : "Create otp successfully",
        "Otp" : otp 
    });
});

module.exports = router;