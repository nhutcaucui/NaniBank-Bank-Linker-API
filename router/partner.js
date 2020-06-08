var express = require('express');
var router = express.Router();
const partner = require('../model/partner');
const partnerMiddleware = require('../middleware/partnerValidate');
const userMiddleware = require('../middleware/userValidate');
const hashMiddleware = require('../middleware/hashValidate');
const verify = require('../middleware/verify');
const debitAccount = require('../model/customers/debit_account');
const info = require('../model/customers/customer_information');
const partner_history = require('../model/partner_transaction_history');

router.post('/add', async function (req, res) {
   var name = req.body["name"];
    if(name == undefined){
        res.status(200).send({
            "status": false,
            "message": "Yo dawg you don't have a name?"
        });
    }

    var publicKey = req.body["publicKey"];
    if (publicKey == undefined) {
        res.status(200).send({
            "status": false,
            "message": "Hey hey hey, what is the key?"
        });
    }

    var hashMethod = req.body["hashMethod"];
    if (hashMethod == undefined) {
        res.status(200).send({
            "status": false,
            "message": "Dude, tell us how you hash your shit so we can contact you later"
        });
    }

    var success = await partner.add(name,publicKey,hashMethod);
    if(!success){
        res.status(200).send({
            "status": false,
            "message": "database error"
        })
    }

    res.status(200).send({
        "status": true,
        "secretKey": "hi mom",
        "message": "If anyone ask, you were never here, now go away, this place is not found"
    })

});

router.post('/transfer', [hashMiddleware, partnerMiddleware, verify], async function (req, res) {
	let id = req.body["id"];
	if(id == undefined){
		res.status(200).send({
			"status": false,
			"message": "id is missing",
		});
	}

	let amount = req.body["amount"];
	if(amount == undefined){
		res.status(200).send({
			"status": false,
			"message": "amount is missing",
		});
	}

	let signature = pgp.sign("hi mom");

	debit.addBalance(id, amount)
	var p = await debit.getId(id);

	var ret = {
		"status": true,
		"message": "Transfer money successfully",
		"balance": p[0]["balance"],
		"signature": signature
	}

	res.status(200).send(ret);
});

router.get('/', [hashMiddleware, partnerMiddleware, verify], async function(req, res) {
    let id = req.query["id"];
    if ( id == undefined) {
        res.status(200).send({
            "Status" : false,
            "Message" : "id param is missing"
        });

        return;
    }

    let result = await info.get(id);

    res.status(200).send({
        "Status" : true, 
        "Info" : info,
    });
});

router.get('/history', [], async function(req, res) {
    let partner_id = req.query["parter_id"];
    let from = req.query["from"];
    let to = req.query["to"];
    if (partner_id == undefined) {
        res.status(200).send({
            "Status" : false,
            "Message" : "partner_id param is missing"
        });
        return;
    }

    if (from == undefined) {
        res.status(200).send({
            "Status" : false,
            "Message" : "from param is missing"
        });
        return;
    }

    if (to == undefined) {
        res.status(200).send({
            "Status" : false,
            "Message" : "to param is missing"
        });
        return;
    }

    let result = await partner_history.get(partner_id, from, to);

    if (result instanceof Error) {
        res.status(200).send({
            "Status" : false,
            "Message" : result.message
        });
        return;
    }

    res.status(200).send({
        "Status" : false,
        "Message" : "Get history successfully",
        "Histories" : result
    });
})

router.get('/statistic', [userMiddleware], async function(req, res) {
    let partner_id = req.query["partner_id"];
    if (partner_id == undefined) {
        res.status(200).send({
            "Status": false,
            "Message" : "partner_id param is missing"
        });

        return;
    }

    let result = await partner_history.statistic(partner_id);
    if (result instanceof Error) {
        res.status(200).send({
            "Status" : false,
            "Message" : result.message
        });

        return;
    }

    res.status(200).send({
        "Status" : true,
        "Message" : "Statistic successfully",
        "Result" : result
    });
});

module.exports = router;