var express = require('express');
var router = express.Router();
const partners = require('../model/partner');
const partnerMiddleware = require('../middleware/partnerValidate');
const userMiddleware = require('../middleware/userValidate');
const hashMiddleware = require('../middleware/hashValidate');
const verify = require('../middleware/verify');
const debits = require('../model/customers/debit_account');
const infos = require('../model/customers/customer_information');
const partner_history = require('../model/partner_transaction_history');
const userValidate = require('../middleware/userValidate');
const customer = require('../model/customers/customer')

router.get('/key', [userMiddleware], async function (req, res) {
    let partner_name = req.query["partner_name"]
    if (partner_name == undefined) {
        res.status(200).send({
            "Status": false,
            "Message": "partner_name param is missing"
        });
        return;
    }

    let result = await partners.name(partner_name);
    if (result instanceof Error) {
        res.status(200).send({
            "Status": false,
            "Message": result.message
        });
        return;
    }
    let partner = result[0];
    res.status(200).send({
        "Status": true,
        "Message": "",
        "Key": partner.publicKey
    });
});

router.post('/add', async function (req, res) {
    var name = req.body["name"];
    if (name == undefined) {
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

    var success = await partners.add(name, publicKey, hashMethod);
    if (!success) {
        res.status(200).send({
            "status": false,
            "message": "database error"
        })
    }

    res.status(200).send({
        "status": true,
        "secretKey": "himom",
        "message": "If anyone ask, you were never here, now go away, this place is not found"
    })

});

router.post('/transfer', [hashMiddleware, partnerMiddleware, verify], async function (req, res) {
    let name = req.headers["name"];
    let from_id = req.body["from_id"];
    let to_id = req.body["to_id"];
    let amount = req.body["amount"];
    let message = req.body["message"];
    if (from_id == undefined) {
        res.status(200).send({
            "status": false,
            "message": "from_id is missing",
        });
    }

    if (to_id == undefined) {
        res.status(200).send({
            "status": false,
            "message": "to_id is missing",
        });
    }

    if (amount == undefined) {
        res.status(200).send({
            "status": false,
            "message": "amount is missing",
        });
    }
    if (message == undefined) {
        res.status(200).send({
            "status": false,
            "message": "message is missing",
        });
    }

    // let signature = pgp.sign("himom");

    let result = await debits.externalTransfer(name, from_id, to_id, amount, message);
    if (result instanceof Error) {
        res.status(200).send({
            "status": false,
            "message" : result.message
        });
        return;
    }
    var ret = {
        "status": true,
        "message": "Transfer money successfully",
    }

    res.status(200).send(ret);
});

router.get('/', [hashMiddleware, partnerMiddleware], async function (req, res) {
    let id = req.query["id"];
    if (id == undefined) {
        res.status(200).send({
            "Status": false,
            "Message": "id param is missing"
        });

        return;
    }

    let debit = await debits.getById(id)

    if(debit instanceof Error){
        res.status(200).send({
            "Status": false,
            "Message": result.message
        });

        return;
    }

    let result = await infos.get(debit.owner);
    if (result instanceof Error) {
        res.status(200).send({
            "Status": false,
            "Message": result.message
        });

        return;
    }
  

    res.status(200).send({
        "Status": true,
        "Info": result.name,
    });
});

router.get('/all', [userValidate], async function (req, res) {
    let result = await partners.all();
    if (result instanceof Error) {
        res.status(200).send({
            "Status": false,
            "Message": result.message
        });

        return;
    }

    res.status(200).send({
        "Status": true,
        "Partners": result,
    });
});

router.get('/history', [], async function (req, res) {
    let partner_id = req.query["parter_id"];
    let from = req.query["from"];
    let to = req.query["to"];
    if (partner_id == undefined) {
        res.status(200).send({
            "Status": false,
            "Message": "partner_id param is missing"
        });
        return;
    }

    if (from == undefined) {
        res.status(200).send({
            "Status": false,
            "Message": "from param is missing"
        });
        return;
    }

    if (to == undefined) {
        res.status(200).send({
            "Status": false,
            "Message": "to param is missing"
        });
        return;
    }

    let result = await partner_history.get(partner_id, from, to);

    if (result instanceof Error) {
        res.status(200).send({
            "Status": false,
            "Message": result.message
        });
        return;
    }

    res.status(200).send({
        "Status": true,
        "Message": "Get history successfully",
        "Histories": result
    });
})

router.get('/history/all', [], async function (req, res) {
    let result = await partner_history.getAll();

    if (result instanceof Error) {
        res.status(200).send({
            "Status": false,
            "Message": result.message
        });
        return;
    }

    res.status(200).send({
        "Status": true,
        "Message": "Get history successfully",
        "Histories": result
    });
})

router.get('/statistic', [userMiddleware], async function (req, res) {
    let partner_id = req.query["partner_id"];
    if (partner_id == undefined) {
        res.status(200).send({
            "Status": false,
            "Message": "partner_id param is missing"
        });

        return;
    }

    let result = await partner_history.statistic(partner_id);
    if (result instanceof Error) {
        res.status(200).send({
            "Status": false,
            "Message": result.message
        });

        return;
    }

    res.status(200).send({
        "Status": true,
        "Message": "Statistic successfully",
        "Result": result
    });
});

router.get('/history/username', [userMiddleware], async function (req, res) {
	let id = req.query["id"];
	let filter = req.query["filter"] == undefined ? "both" : req.query["filter"];
	var receiverHistories;
	var senderHistories;
	
	if (id == undefined) {
		res.status(200).send({
			"Status": false,
			"Message": "id param is missing"
		});
		return;
	}

	let usernameQuery = await customer.getByName(id);
	if (usernameQuery instanceof Error || usernameQuery.length == 0) {
        res.status(200).send({
            "Status" : false,
            "Message" : "User not found"
        });
        return;
	}
	
	console.log(usernameQuery.debit.id)

	switch (filter) {
		case "receiver":
            receiverHistories = await partner_history.receiverHistory(usernameQuery.debit.id);
            res.status(200).send({
				"Status": true,
				"Message": "Query successfully",
				"Histories": [
					...receiverHistories
				]
			});
			break;
		case "sender":
            senderHistories = await partner_history.senderHistory(usernameQuery.debit.id);
            res.status(200).send({
				"Status": true,
				"Message": "Query successfully",
				"Histories": [
					...senderHistories,
				]
			});
			break;
		case "both":
			receiverHistories = await partner_history.receiverHistory(usernameQuery.debit.id);
            senderHistories = await partner_history.senderHistory(usernameQuery.debit.id);
            res.status(200).send({
				"Status": true,
				"Message": "Query successfully",
				"Histories": [
					...senderHistories,
					...receiverHistories
				]
			});
			break;
		default:
			receiverHistories = await partner_history.receiverHistory(usernameQuery.debit.id);
            senderHistories = await partner_history.senderHistory(usernameQuery.debit.id);
            res.status(200).send({
				"Status": true,
				"Message": "Query successfully",
				"Histories": [
					...senderHistories,
					...receiverHistories
				]
			});
			break;
	}

	// res.status(200).send({
	// 	"Status": true,
	// 	"Message": "Query successfully",
	// 	"Histories": [
	// 		...receiverHistories,
	// 		...senderHistories
	// 	]
	// });
});

router.get('/history/debit', [userMiddleware], async function (req, res) {
	let id = req.query["id"];
	let filter = req.query["filter"] == undefined ? "both" : req.query["filter"];
	var receiverHistories;
	var senderHistories;
	
	if (id == undefined) {
		res.status(200).send({
			"Status": false,
			"Message": "id param is missing"
		});
		return;
	}

	switch (filter) {
		case "receiver":
            receiverHistories = await partner_history.receiverHistory(id);
            res.status(200).send({
				"Status": true,
				"Message": "Query successfully",
				"Histories": [
					...receiverHistories
				]
			});
			break;
		case "sender":
            senderHistories = await partner_history.senderHistory(id);
            res.status(200).send({
				"Status": true,
				"Message": "Query successfully",
				"Histories": [
					...senderHistories,
				]
			});
			break;
		case "both":
			receiverHistories = await partner_history.receiverHistory(id);
            senderHistories = await partner_history.senderHistory(id);
            res.status(200).send({
				"Status": true,
				"Message": "Query successfully",
				"Histories": [
					...senderHistories,
					...receiverHistories
				]
			});
			break;
		default:
			receiverHistories = await partner_history.receiverHistory(id);
            senderHistories = await partner_history.senderHistory(id);
            res.status(200).send({
				"Status": true,
				"Message": "Query successfully",
				"Histories": [
					...senderHistories,
					...receiverHistories
				]
			});
			break;
	}

	res.status(200).send({
		"Status": true,
		"Message": "Query successfully",
		"Histories": [
			...receiverHistories,
			...senderHistories
		]
	});
});

module.exports = router;