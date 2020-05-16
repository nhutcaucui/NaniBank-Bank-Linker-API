var express = require('express');
var router = express.Router();
const crypto = require('crypto');
const fs = require('fs');
const pgp = require('../security/pgp');

router.get('/', function (req, res, next) {
	crypto.createVerify("SHA256");
	verify.update("Hi mom")
});

router.post('/draw', function (req, res, next) {
	pgp.sign("meo").then((value) => {
		pgp.verify("hi mom").then((success)=> {
			if (success) {
				res.status(200).send("hi mom");
			} else {
				res.status(200).send("noooo");
			}
			
		} )

	});


});

router.post('/charge', function (req, res, next) {

});

module.exports = router;
