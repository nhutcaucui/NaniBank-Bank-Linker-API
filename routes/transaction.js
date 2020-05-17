var express = require('express');
var router = express.Router();
const pgp = require('../security/pgp');
const rsa = require('../security/rsa');
const partner = require('../model/partner');

router.get('/', function (req, res, next) {
});

router.post('/draw', async function (req, res, next) {
	let id = req.body["id"];
	let name = req.body["name"];
	let request = req.body["request"];
	let signature = req.body["signature"];

	let result = {
		"status" : false,
		"message" : ""
	}

	p = await partner.name(name);
	if (p.length == 0){
		console.log("not found");
	}
	
	console.log("[meo]", p);
	let publicKey = p[0]["publicKey"];
	let type = p[0]["type"];

	if (type == "rsa")
	{
		rsa.verify("hi mom", signature);
	}

	if (type == "pgp")
	{
		pgp.verify(signature, publicKey);
	}


	res.status(200).send(result);

});

router.post('/charge', function (req, res, next) {

});

module.exports = router;
