var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.status(200).send('good morning');
});

router.get('/login', function (req, res) {

});

module.exports = router;
