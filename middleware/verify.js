const partners = require('../model/partner');
const pgp = require('../security/pgp');
const fs = require('fs')

async function verify(req, res, next) {
    let name = req.headers["name"];
    let signature = req.headers["sig"];
    if(signature == undefined){
        res.status(200).send({
			"status": false,
			"message": "sig header is missing"
        })
        
        return;
    }
    
    let result= await partners.name(name);
    if (result instanceof Error) {
        res.status(200).send({
            "status" : false,
            "message" : result.message
        });
        return;
    }

    let p = result;

	// success = await pgp.verify(signature, publicKey);
    success = await pgp.detachedVerify(signature, name);
    if (!success) {
		res.status(200).send({
			"status": false,
			"message": "Key has problems"
        })
        
        return;
    }

    next();
}

module.exports = verify;