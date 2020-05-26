var express = require('express');
var router = express.Router();

const crypto = require("crypto-js");
const partner = require('../model/partner');
const debit = require('../model/debit_account');
const partnerMiddleware = require('../middleware/partnerValidate');
const hashMiddleware = require('../middleware/hashValidate');
const verify = require('../middleware/verify');
const pgp = require('../security/pgp');
router.get('/', function (req, res, next) {
});

router.post('/draw', [partnerMiddleware, hashMiddleware], async function (req, res) {
	let id = req.body["id"];
	let request = req.body["request"];
	let amount = req.body["amount"];

	let signature = pgp.sign("hi mom");
	res.status(200).send({
		"status": true,
		"message": "Draw successfully",
		"Balance remaining": "",
		"signature": signature
	});
});

router.post('/add', [partnerMiddleware, hashMiddleware,verify], function (req, res) {
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

	p = debit.addBalance(id, amount)
	console.log(p[0]);

	var ret = {
		"status": true,
		"message": "Transfer money successfully",
		"balance remaining": "Never gonna give you up, never gonna let you down",
		"signature": signature
	}

	res.status(200).send(ret);
});

module.exports = router;
