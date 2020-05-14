var express = require('express');
var router = express.Router();
const crypto = require('crypto');
const secret = 'abcdefg';
const hash = crypto.createHmac('sha256', secret)
                   .update('I love cupcakes')
                   .digest('hex');
/* GET home page. */
router.get('/', function(req, res, next) {
  crypto.createVerify("SHA256");
  verify.update("I love cupcakes")
});

router.post('/fund', function(req, res, next) {

});

router.post('/charge', function(req, res, next) {

});

module.exports = router;
