const Crypto = require('crypto');

async function hashAuthenValidate(req, res, next) {
    var hash = req.headers["authen-hash"];
    var decodedBase64 = Buffer.from(hash, 'base64').toString('ascii');

    var stringCheck = req.headers["timestamp"] + "secret key go brr brr" + JSON.stringify(req.body);

    if(Crypto.createHash('sha256').update(stringCheck) != decodedBase64){
        res.status(200).send({
			"status": false,
			"message": "Tampered"
        })
        
        return;
    }

    next();
}

module.exports = hashAuthenValidate;