const partner = require('../model/partner');
const pgp = require('../security/pgp');
const rsa = require('../security/rsa');

async function verify(req, res, next) {
    let name = req.body["name"];
    let signature = req.headers["sig"];
    
    p = await partner.name(name);

    let publicKey = p[0]["publicKey"];
    let type = p[0]["type"];

    success = true;
	switch (type) {
		case "rsa":
			success = await rsa.verify("hi mom", signature, publicKey);
			break;
		case "pgp":
			success = await pgp.verify(signature, publicKey);
			break;
	}

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