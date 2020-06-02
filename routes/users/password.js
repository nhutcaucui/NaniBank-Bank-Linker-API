var express = require('express');
var router = express.Router();
const moment = require('moment');
const userMiddleware = require('../../middleware/userValidate');
const jwt = require('jsonwebtoken');
const users = require('../../model/users');

router.post('/forget', async function(req, res) {
    let time = moment();
    let token = "";
    let id = req.body["id"];

    let user = await users.getId(id);
    
    let email = user["email"];

    let token =jwt.sign({
        "id": id,
    }, "hi mom");
    //send mail contains the token to help them change the password
});

router.post('/change', [userMiddleware], async function(req, res) {
    let old_password = req.body["old_password"];
    let new_password = req.body["new_password"];
    let id = req.body["id"];

    let result = await users.changePassword(id, old_password, new_password);

    res.status(200).send(result);
});

module.exports = router;