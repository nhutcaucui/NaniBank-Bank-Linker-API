var express = require('express');
var router = express.Router();
const pgp = require('../security/pgp');
const rsa = require('../security/rsa');
const partner = require('../model/partner');
const partnerMiddleware = require('../middleware/partnerValidate');

router.get('/', function (req, res, next) {
});

router.post('/draw', partnerMiddleware, async function (req, res, next) {
	let id = req.body["id"];
	let name = req.body["name"];
	let request = req.body["request"];
	let signature = req.body["signature"];

	let result = {
		"status": false,
		"message": ""
	}

	p = await partner.name(name);
	if (p.length == 0) {
		res.status(200).send({
			"status": false,
			"message": "invalid user"
		});

		return;
	}

	let publicKey = p[0]["publicKey"];
	let type = p[0]["type"];
	switch (type) {
		case 1:
			result.status = await rsa.verify("hi mom", signature);
			break;
		case 2:
			result.status = await pgp.verify(signature, publicKey);
			break;

	}

	res.status(200).send(result);

});

router.post('/charge', function (req, res, next) {

});

module.exports = router;
