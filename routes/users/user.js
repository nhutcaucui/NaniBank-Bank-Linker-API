var express = require('express');
var admin = require('./admin');
var customer = require('./customer');
var employee = require('./employee');
var router = express.Router();
const userMiddleware = require('../../middleware/userValidate');

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.status(200).send('good morning');
});

router.post('/password', function (req, res) {

});

router.post('/login', function (req, res) {
    res.status(200).send({
        "Status": true,
        "Message": "Login successfully",
        "Token": "",
    });
});





router.post('/notify', [userMiddleware], function(req, res) {
    res.status(200).send({
        "Status": true,
        "Message": "",
    });
});

router.use('/admin', admin);
router.use('/customer', customer);
router.use('/employee', employee);

module.exports = router;
