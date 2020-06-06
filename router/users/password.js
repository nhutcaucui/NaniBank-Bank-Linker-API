var express = require('express');
var router = express.Router();
const moment = require('moment');
const userMiddleware = require('../../middleware/userValidate');
const jwt = require('jsonwebtoken');
const customers = require('../../model/customers/customer');

router.post('/forget', async function(req, res) {
    let time = moment();
    let token = "";
    let id = req.body["id"];

    let user = await customers.getByName(id);
    if (user.length == 0){
        res.status(200).send({
            "Status" : false,
            "Message" : "Cannot find the specified user",
        });

        return;
    }

    let email = user["email"];

    let token = jwt.sign({
        "id": id,
    }, "hi mom");
    //send mail contains the token to help them change the password
});

router.post('/change', [userMiddleware], async function(req, res) {
    let old_password = req.body["old_password"];
    let new_password = req.body["new_password"];
    let id = req.body["id"];

    let result = await customers.changePassword(id, old_password, new_password);

    res.status(200).send(result);
});

module.exports = router;