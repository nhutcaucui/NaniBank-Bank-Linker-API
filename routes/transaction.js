var express = require('express');
var router = express.Router();

const partner = require('../model/partner');
const partnerMiddleware = require('../middleware/partnerValidate');
const pgp = require('../security/pgp');
router.get('/', function (req, res, next) {
});

router.post('/draw', partnerMiddleware, async function (req, res) {
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

router.post('/charge', partnerMiddleware, function (req, res) {
	let amount = req.body["amount"];

	res.status(200).send({
		"status": true,
		"message": "Draw successfully",
		"balance remaining": "",
		"signature": ""
	});
});

module.exports = router;
