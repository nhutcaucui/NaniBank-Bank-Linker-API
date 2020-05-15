var express = require('express');
var router = express.Router();
const crypto = require('crypto');
const secret = 'abcdefg';
const hash = crypto.createHmac('sha256', secret)
	.update('Hi mom')
	.digest('hex');
/* GET home page. */
router.get('/', function (req, res, next) {
	crypto.createVerify("SHA256");
	verify.update("Hi mom")
});

router.post('/draw', function (req, res, next) {
	res.status(200).send("hi mom");
});

router.post('/charge', function (req, res, next) {

});

module.exports = router;
