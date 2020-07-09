const Crypto = require('crypto');
const sha256 = require('sha256');

async function hashAuthenValidate(req, res, next) {
    var hash = req.headers["authen-hash"];
    if(hash == undefined){
        res.status(200).send({
			"status": false,
			"message": "No hash"
        })

        return;
    }
    //var decodedBase64 = await Buffer.from(hash, 'base64').toString('ascii');

    var stringCheck = req.headers["timestamp"] + "himom" + JSON.stringify(req.body);
    var hashCheck = await Crypto.createHash('sha256').update(stringCheck).digest('hex');

    console.log(hashCheck);
    if(hashCheck != hash){
        res.status(200).send({
			"status": false,
			"message": "Tampered"
        })
        
        return;
    }

    next();
}

module.exports = hashAuthenValidate;