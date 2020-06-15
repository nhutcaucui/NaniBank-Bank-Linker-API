var express = require('express');
var router = express.Router();

const debit = require('../model/customers/debit_account');
const userMiddleware = require('../middleware/userValidate');
const otpMiddleware = require('../middleware/otpValidate').otpValidate;
const history = require('../model/transaction_history');

router.post('/charge', [userMiddleware, otpMiddleware], async function (req, res) {
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

router.post('/draw', [userMiddleware, otpMiddleware], async function (req, res) {
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

	let result = debit.transfer(from, to, amount, message);
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
	});
});

router.get('/history', [userMiddleware], async function (req, res) {
	let id = req.query["id"];
	let filter = req.query["filter"] == undefined ? "both" : req.query["filter"];
	let receiverHistories;
	let senderHistories;

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
			break;
		case "sender":
			senderHistories = await histories.senderHistory(id);
			break;
		case "both":
			receiverHistories = await histories.receiverHistory(id);
			senderHistories = await histories.senderHistory(id);
			break;
		default:
			receiverHistories = await histories.receiverHistory(id);
			senderHistories = await histories.senderHistory(id);
			break;
	}

	res.status(200).send({
		"Status": true,
		"Message": "Query successfully",
		"Histories": [
			...receiverHistories,
			...senderHistory
		]
	});
});

module.exports = router;
