var express = require('express');
var admin = require('./admin');
var customer = require('./customer');
var employee = require('./employee');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.status(200).send('good morning');
});

router.post('/password', function (req, res) {

});

router.use('/admin', admin);
router.use('/customer', customer);
router.use('/employee', employee);

module.exports = router;
