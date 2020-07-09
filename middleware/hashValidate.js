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
    let timestamp = req.headers["timestamp"];
    var stringCheck = timestamp + "himom" + JSON.stringify(req.body);
    var hashCheck = await Crypto.createHash('sha256').update(stringCheck).digest('hex');
    var nguyen = sha256(stringCheck);

    console.log("[Check]", stringCheck);
    console.log(hashCheck);
    console.log(nguyen);
    console.log(hashCheck == nguyen);
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