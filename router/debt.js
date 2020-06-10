var express = require('express');
var router = express.Router();
const debit = require('../model/customers/debit_account');
const customer = require('../model/customers/customer');
const debt = require('../model/customers/debt');
const userMiddleware = require('../middleware/userValidate');

router.get('/', [userMiddleware], async function(req, res) {
    let customer_id = req.query["customer_id"];

    if (customer_id == undefined) {
        res.status(200).send({
            "Status" : false,
            "Message" : "customer_id param is missing"
        });
        return;
    }

    let result = await debt.getRelative(customer_id);
    if (result instanceof Error) {
        res.status(200).send({
            "Status" : false,
            "Message" : result.message
        });
        return;
    }

    res.status(200).send({
        "Status" : true,
        "Message" : "",
        "Debt" : result
    });
});

router.post('/', [userMiddleware], async function(req, res) {
    let creditor = req.body["creditor"];
    let debtor = req.body["debtor"];
    let name = req.body["name"];
    let amount = req.body["amount"];
    let issue_date = req.body["issue_date"];

    if (creditor == undefined) {
        res.status(200).send({
            "Status" : false,
            "Message" : "creditor param is missing"
        });

        return;
    }

    if (debtor == undefined) {
        res.status(200).send({
            "Status" : false,
            "Message" : "debtor param is missing"
        });

        return;
    }

    if (name == undefined) {
        res.status(200).send({
            "Status" : false,
            "Message" : "name param is missing"
        });

        return;
    }
    
    if (amount == undefined) {
        res.status(200).send({
            "Status" : false,
            "Message" : "amount param is missing"
        });

        return;
    }

    if (issue_date == undefined) {
        res.status(200).send({
            "Status" : false,
            "Message" : "issue_date param is missing"
        });

        return;
    }

    let result = await debt.create(creditor, debtor, name, amount, issue_date);

    if (result instanceof Error) {
        res.status(200).send({
            "Status" : false,
            "Message" : result.message
        });

        return;
    }

    res.status(200).send( {
        "Status" : true,
        "Message" : "Create new debt alarm successfully",
        "Debt" : result
    });
});

router.post('/pay', [userMiddleware], async function(req, res) {
    let id = req.body["id"];

    if (id == undefined) {
        res.status(200).send({
            "Status" : false,
            "Message" : "id param is missing"
        });

        return;
    }
    let debt_record = await debt.get(id);

    if (debt_record instanceof Error) {
        res.status(200).send({
            "Status" : false,
            "Message" : debt_record.message
        });

        return;
    }

    let creditor = await customer.getById(debt_record.creditor);
    let debtor = await customer.getById(debt_record.debtor);

    let result = await debit.transfer(debtor.debit.id, creditor.debit.id, debt_record.amount, 4, "Pay the debt " + debt_record.name);

    if (result instanceof Error) {
        res.status(200).send({
            "Status" : false,
            "Message" : result.message
        });

        return;
    }

    result = await debt.paid(debt_record.id);
    res.status(200).send({
        "Status" : true,
        "Message" : "The debt is paid successfully"
    });
});

router.delete('/', [userMiddleware], async function(req, res) {
    let id = req.body["id"];
    if (id == undefined) {
        res.status(200).send({
            "Status" : false,
            "Message" : "id param is missing"
        });

        return;
    }
    let debt_record = await debt.get(id);

    if (debt_record instanceof Error) {
        res.status(200).send({
            "Status" : false,
            "Message" : debt_record.message
        });

        return;
    }

    let result = await debt.paid(id);

    if (result instanceof Error) {
        res.status(200).send({
            "Status" : false,
            "Message" : result.message
        });

        return;
    }

    res.status(200).send({
        "Status" : true,
        "Message" : "Remove debt successfully"
    });
});

module.exports = router;