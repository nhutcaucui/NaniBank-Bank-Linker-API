var express = require('express');
var router = express.Router();
const debits = require('../model/customers/debit_account');
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

    let result = await debits.create(customer_id);
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

router.get('/', [userMiddleware], async function(req, res) {
    let debit_id = req.query["debit_id"]
    let owner = req.query["owner"]

    if (debit_id == undefined && owner == undefined) {
        res.status(200).send({
            "Status" : false,
            "Message" : "need debit_id or owner param"
        });
        return;
    }    

    let result;
    if (debit_id != undefined) {
        result = await debits.getById(debit_id);
    } else {
        result = await debits.getByOwner(owner);
    }   

    if (result instanceof Error) {
        res.status(200).send({
            "Status" : false,
            "Message" : result.message
        });
        return;
    }

    res.status(200).send({
        "Status" : true,
        "Message" : "Get debit account successfully",
        "Debit": result
    });
})

module.exports = router;