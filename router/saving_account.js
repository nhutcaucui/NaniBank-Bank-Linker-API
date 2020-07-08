var express = require('express');
var router = express.Router();
const debits = require('../model/customers/debit_account');
const customers = require('../model/customers/customer');
const saves = require('../model/customers/saving_account');
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
    let result = await saves.create(customer_id, name, term);
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

router.get('/', [userMiddleware], async function(req, res) {
    let name = req.query["name"];
    let owner = req.query["owner"];

    if (name == undefined) {
        res.status(200).send({
            "Status" : false,
            "Message" : "name param is missing"
        });
        return;
    }
    if (owner == undefined) {
        res.status(200).send({
            "Status" : false,
            "Message" : "name param is missing"
        });
        return;
    }

    let result = await saves.get(name, owner);
    if (result instanceof Error) {
        res.status(200).send({
            "Status" : false,
            "Message": result.message
        });
        return;
    }

    res.status(200).send({
        "Status":true,
        "Message" : "Get saving account successfully",
        "Saving": result
    })
})

router.get('/s', [userMiddleware], async function(req, res) {
    let owner = req.query["owner"];
    if (owner == undefined) {
        res.status(200).send({
            "Status" : false,
            "Message" : "name param is missing"
        });
        return;
    }

    let result = await saves.getByOwner(owner);
    if (result instanceof Error) {
        res.status(200).send({
            "Status" : false,
            "Message": result.message
        });
        return;
    }

    res.status(200).send({
        "Status":true,
        "Message" : "Get saving account successfully",
        "Saving": result
    })
})

module.exports = router;