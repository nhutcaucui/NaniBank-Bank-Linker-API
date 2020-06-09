var express = require('express');
var router = express.Router();
const userMiddleware = require('../middleware/userValidate');
const createOtp = require('../middleware/otpValidate').createOtp;
const mail = require('../mail/otpMail');
const customer = require('../model/customers/customer');
router.get('/create', [userMiddleware], async function(req, res) {
    let access_token = req.headers["access-token"];
    let pack = createOtp(access_token);
    let id = req.body["customer_id"];

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

    mail(info, pack.otp);
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