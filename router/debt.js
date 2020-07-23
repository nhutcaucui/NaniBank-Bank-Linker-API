var express = require('express');
var router = express.Router();
const debit = require('../model/customers/debit_account');
const customer = require('../model/customers/customer');
const debt = require('../model/customers/debt');
const userMiddleware = require('../middleware/userValidate');
const otpMiddleware = require('../middleware/otpValidate').otpValidate;

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

router.get('/username', [userMiddleware], async function(req, res) {
    let customer_id = req.query["customer_id"];

    if (customer_id == undefined) {
        res.status(200).send({
            "Status" : false,
            "Message" : "customer_id param is missing"
        });
        return;
    }

    let usernameQuery = await customer.getByName(customer_id);

    console.log(usernameQuery)

    let result = await debt.getRelative(usernameQuery.id);
    if (result instanceof Error || result.length == 0) {
        res.status(200).send({
            "Status" : false,
            "Message" : result.message
        });
        return;
    }
    console.log(result);

    res.status(200).send({
        "Status" : true,
        "Message" : "",
        "Debt" : result
    });
});

router.get('/debit', [userMiddleware], async function(req, res) {
    let customer_id = req.query["customer_id"];

    if (customer_id == undefined) {
        res.status(200).send({
            "Status" : false,
            "Message" : "customer_id param is missing"
        });
        return;
    }

    let debitAccount = await debit.getById(customer_id);

    console.log(debitAccount)

    let result = await debt.getRelative(debitAccount.owner);
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

router.post('/pay', [userMiddleware, otpMiddleware], async function(req, res) {
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

    let record = debt_record[0];

    let creditor = await customer.getById(record.creditor);
    let debtor = await customer.getById(record.debtor);
    let result = await debit.transfer(debtor.debit.id, creditor.debit.id, record.amount, 4, "Pay the debt " + record.name);

    if (result instanceof Error) {
        res.status(200).send({
            "Status" : false,
            "Message" : result.message
        });

        return;
    }

    result2 = await debt.paid(record.id);
    res.status(200).send({
        "Status" : true,
        "Message" : "The debt is paid successfully",
        "Account": result.fromAccount
    });
});

router.delete('/', [userMiddleware], async function(req, res) {
    let id = req.body["id"];
    let delete_message = req.body["delete_messsage"]
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