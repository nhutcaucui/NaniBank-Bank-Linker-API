const partner = require('../model/partner');
const pgp = require('../security/pgp');
const rsa = require('../security/rsa');

async function partnerValidate(req, res, next) {
	let name = req.headers["name"];
    let success = false;
    if (!name) {
        res.status(200).send({
            "status": false,
            "message": "name header is missing"
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
  
    req.app.locals.partner = p;
    next();
}

module.exports = partnerValidate;