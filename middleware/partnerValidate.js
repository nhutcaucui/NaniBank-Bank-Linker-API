const partner = require('../model/partner');
const pgp = require('../security/pgp');
const rsa = require('../security/rsa');

async function partnerValidate(req, res, next) {
	let name = req.body["name"];
    let success = false;
    if (!name) {
        res.status(200).send({
            "status": false,
            "message": "name param is missing"
        });

        return;
    }

    p = await partner.name(name);
	if (p.length == 0) {
		res.status(200).send({
			"status": false,
			"message": "invalid user"
		});

		return;
	}

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
			"message": ""
        })
        
        return;
    }
    
    req.app.locals.partner = p;
    next();
}

module.exports = partnerValidate;