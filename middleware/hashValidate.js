const Crypto = require('crypto');

async function hashAuthenValidate(req, res, next) {
    var hash = req.headers["authen-hash"];
    var decodedBase64 = await Buffer.from(hash, 'base64').toString('ascii');

    var stringCheck = req.headers["timestamp"] + "hi mom" + JSON.stringify(req.body);
    var hashCheck = await Crypto.createHash('sha256').update(stringCheck);

    if(hashCheck != decodedBase64){
        res.status(200).send({
			"status": false,
			"message": "Tampered"
        })
        
        return;
    }

    next();
}

module.exports = hashAuthenValidate;