function partnerValidate(req, res, next) {
	let name = req.body["name"];
    
    if (!name) {
        res.status(200).send({
            "status": false,
            "message": "name param is missing"
        });

        return;
    }

    next();
}

module.exports = partnerValidate;