var express = require('express');
var router = express.Router();

const debit = require('../model/customers/debit_account');
const userMiddleware = require('../middleware/userValidate');
const otpMiddleware = require('../middleware/otpValidate').otpValidate;
const histories = require('../model/transaction_history');
const customer = require('../model/customers/customer')

router.post('/charge', [userMiddleware], async function (req, res) {
	let id = req.body["id"];
	let amount = req.body["amount"];

	if (id == undefined) {
		res.status(200).send({
			"Status" : false,
			"Message" : "id param is missing"
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

	let result = await debit.charge(id, amount);

	if (result instanceof Error) {
		res.status(200).send({
			"Status": false,
			"Message": result.message
		});
		return;
	}

	res.status(200).send({
		"Status": true,
		"Message": "Charge successfully",
		"Account": result,
	});

});

router.post('/check', [userMiddleware], async function (req, res) {
	let id = req.body["id"];
	let amount = req.body["amount"];

	if (id == undefined) {
		res.status(200).send({
			"Status" : false,
			"Message" : "id param is missing"
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

	let result = await debit.check(id, amount);

	if (result) {
		res.status(200).send({
			"Status": true,
			"Message": "Account has enough",
		});
		return;
	}
	else{
		res.status(200).send({
			"Status": false,
			"Message": "Account doesn't have enough money",
		});
		return;
	}
	

});

router.post('/draw', [userMiddleware], async function (req, res) {
	let id = req.body["id"];
	let amount = req.body["amount"];

	let result = await debit.draw(id, amount);

	if (result instanceof Error) {
		res.status(200).send({
			"Status": false,
			"Message": result.message
		});

		return;
	}

	res.status(200).send({
		"Status": true,
		"Message": "Draw successfully",
		"Account": result,
	});
});

router.post('/transfer', [userMiddleware, otpMiddleware], async function(req, res) {
	let from = req.body["from"];
	let to = req.body["to"];
	let amount = req.body["amount"];
	let message = req.body["message"];
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

	if (amount == undefined) {
		res.status(200).send({
			"Status" : false,
			"Message" : "amount param is missing"
		});
		return;
	}

	if (message == undefined) {
		message = "Transfer money";
	}

	let result = await debit.transfer(from, to, amount, message);
	if (result instanceof Error) {
		res.status(200).send({
			"Status" : false,
			"Message" : result.message
		});

		return;
	}

	res.status(200).send({
		"Status" : true,
		"Message" : "Transfer successfully",
		"Account": result.fromAccount
	});
});

router.get('/history/all', [userMiddleware], async function(req, res) {
	let result = await histories.all();
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
		"Histories" : result
	});
});

router.get('/history', [userMiddleware], async function (req, res) {
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
			receiverHistories = await histories.receiverHistory(id);
			res.status(200).send({
				"Status": true,
				"Message": "Query successfully",
				"Histories": [
					...receiverHistories
				]
			});
			break;
		case "sender":
			senderHistories = await histories.senderHistory(id);
			res.status(200).send({
				"Status": true,
				"Message": "Query successfully",
				"Histories": [
					...senderHistories
				]
			});
			break;
		case "both":
			receiverHistories = await histories.receiverHistory(id);
			senderHistories = await histories.senderHistory(id);
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
			receiverHistories = await histories.receiverHistory(id);
			senderHistories = await histories.senderHistory(id);
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

	switch (filter) {
		case "receiver":
			receiverHistories = await histories.receiverHistory(usernameQuery.debit.id);
			res.status(200).send({
				"Status": true,
				"Message": "Query successfully",
				"Histories": [
					...receiverHistories,
				]
			});
			break;
		case "sender":
			senderHistories = await histories.senderHistory(usernameQuery.debit.id);
			res.status(200).send({
				"Status": true,
				"Message": "Query successfully",
				"Histories": [
					...senderHistories,
				]
			});
			break;
		case "both":
			receiverHistories = await histories.receiverHistory(usernameQuery.debit.id);
			senderHistories = await histories.senderHistory(usernameQuery.debit.id);
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
			receiverHistories = await histories.receiverHistory(usernameQuery.debit.id);
			senderHistories = await histories.senderHistory(usernameQuery.debit.id);
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
			receiverHistories = await histories.receiverHistory(id);
			res.status(200).send({
				"Status": true,
				"Message": "Query successfully",
				"Histories": [
					...receiverHistories
				]
			});
			break;
		case "sender":
			senderHistories = await histories.senderHistory(id);
			res.status(200).send({
				"Status": true,
				"Message": "Query successfully",
				"Histories": [
					...senderHistories,
				]
			});
			break;
		case "both":
			receiverHistories = await histories.receiverHistory(id);
			senderHistories = await histories.senderHistory(id);
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
			receiverHistories = await histories.receiverHistory(id);
			senderHistories = await histories.senderHistory(id);
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

module.exports = router;
