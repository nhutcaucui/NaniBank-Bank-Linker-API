const partner = require('../model/partner');
const pgp = require('../security/pgp');
const rsa = require('../security/rsa');

async function verify(req, res, next) {
    let name = req.body["name"];
    let signature = req.headers["sig"];
    if(signature == undefined){
        res.status(200).send({
			"status": false,
			"message": "Signature is missing"
        })
        
        return;
    }
    
    p = await partner.name(name);

    let publicKey = p[0]["publicKey"];
    let type = p[0]["type"];

console.log(publicKey);

    success = true;
    
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