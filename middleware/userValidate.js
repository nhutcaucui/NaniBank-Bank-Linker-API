const jwt = require("jsonwebtoken");
const config = require('config');
const secret_key = config.get('secret-key');
const moment = require('moment');

function userValidate(req, res, next) {
    let token = req.headers['access-token'];
    if (token == undefined) {
        res.status(200).send({
            "Status": false,
            "Message": "Authorization needed"
        });

        return;
    }

    jwt.verify(token, secret_key, function (err, decoded) {
        if (err) {
            res.status(200).send({
                "Status": false,
                "Message": err.message
            });

            return;
        }

        next();
    });
}

module.exports = userValidate;