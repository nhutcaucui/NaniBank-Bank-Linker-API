var express = require('express');
var router = express.Router();
const debit = require('../model/customers/debit_account');
const customer = require('../model/customers/customer');
const userMiddleware = require('../middleware/userValidate');

router.post('/create', [userMiddleware], async function(req, res) {
    let customer_id = req.body["customer_id"];
    if (customer_id == undefined) {
        res.status(200).send({
            "Status" : false,
            "Message" : "customer_id param is missing"
        });
        return;
    }

    let result = await debit.create(customer_id);
    if (result instanceof Error) {
        res.status(200).send({
            "Status" : false,
            "Message" : result.message
        });
        return;
    }

    res.status(200).send({
        "Status" : true,
        "Message" : result
    });
});

module.exports = router;