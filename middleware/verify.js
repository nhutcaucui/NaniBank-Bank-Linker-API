const partner = require('../model/partner');
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
    
    let result= await partner.name(name);
    if (result instanceof Error) {
        res.status(200).send({
            "status" : false,
            "message" : result.message
        });
        return;
    }

    let partner = result;
    let publicKey = partner["publicKey"];

	success = await pgp.verify(signature, publicKey);

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