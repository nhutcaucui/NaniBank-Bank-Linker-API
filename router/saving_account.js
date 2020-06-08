var express = require('express');
var router = express.Router();
const debit = require('../model/customers/debit_account');
const customer = require('../model/customers/customer');
const saving = require('../model/customers/saving_account');
const userMiddleware = require('../middleware/userValidate');

router.post('/', [userMiddleware], async function(req, res) {
    let customer_id = req.body["customer_id"];
    let name = req.body["name"];
    let term = req.body["term"];

    if (customer_id == undefined) {
        res.status(200).send({
            "Status" : false,
            "Message" : "customer_id param is missing"
        });
    }

    if (name == undefined) {
        res.status(200).send({
            "Status" : false,
            "Message" : "name param is missing"
        });
    }

    if (term == undefined) {
        res.status(200).send({
            "Status" : false,
            "Message" : "term param is missing"
        });
    }
    let result = await saving.create(customer_id, name, term);
    if (result instanceof Error) {
        res.status(200).send({
            "Status" : false,
            "Message" : result.message
        });
        return;
    }

    res.status(200).send({
        "Status" : true,
        "Message" : "Create new saving account successfully",
        "Account" : result
    });
});

module.exports = router;