var express = require('express');
var router = express.Router();
const moment = require('moment');
const userMiddleware = require('../../middleware/userValidate');
const otpMiddleware = require('../../middleware/otpValidate').otpValidate;
const createOtp = require('../../middleware/otpValidate').createOtp;
const jwt = require('jsonwebtoken');
const customers = require('../../model/customers/customer');
const axios = require('axios').default;

router.post('/request-reset', async function(req, res) {
    let username = req.body["username"];
    let email = req.body["email"];

    if (username == undefined) {
        res.status(200).send({
            "Status" : false,
            "Message" : "username param is missing"
        });
        return;
    }

    if (email == undefined) {
        res.status(200).send({
            "Status" : false,
            "Message" : "email param is missing"
        });
        return;
    }

    let result = await customers.getByName(username, false);
    let pack = createOtp();
});

router.post('/reset', [otpMiddleware], async function(req, res) {
    let username = req.body["username"];
    let email = req.body["email"];
    let new_password = req.body["new_password"];

    if (username == undefined) {
        res.status(200).send({
            "Status" : false,
            "Message" : "username param is missing"
        });
        return;
    }

    if (email == undefined) {
        res.status(200).send({
            "Status" : false,
            "Message" : "email param is missing"
        });
        return;
    }

    if (new_password == undefined) {
        res.status(200).send({
            "Status" : false,
            "Message" : "new_password param is missing"
        });
        return;
    }

    let result = await customers.resetPassword(username, result.password, new_password);
    if (result instanceof Error) {
        res.status(200).send({
            "Status" : false,
            "Message" : result.Message
        });

        return;
    }

    res.status(200).send({
        "Status" : true,
        "Message" : "Reset password successfully"
    });
});

router.post('/change', [userMiddleware], async function(req, res) {
    let old_password = req.body["old_password"];
    let new_password = req.body["new_password"];
    let id = req.body["id"];

    let result = await customers.changePassword(id, old_password, new_password);
    if (result instanceof Error) {
        res.status(200).send({
            "Status" : false,
            "Message" : result.message
        });
        return;
    } 
    res.status(200).send(result);
});

module.exports = router;