var express = require('express');
var router = express.Router();

const crypto = require("crypto-js");
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

router.post('/add', [hashMiddleware, partnerMiddleware, verify], async function (req, res) {
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


router.post('/transaction', [userMiddleware], function(req, res) {
    
});

module.exports = router;
