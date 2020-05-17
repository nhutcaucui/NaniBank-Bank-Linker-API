var moment = require('moment');

function timeValidate(req, res, next) {
    let date = req.headers.date;
    if (date == undefined) {
        res.status(200).send({
            "status": false,
            "message": "date header is missing"
        });

        return;
    }
    
    let diff = moment(date, "X").unix() - moment().unix();
    if (diff > 30)
    {
        console.log("[Time]", "request is over", diff, "seconds");
        res.status(200).send({
            "status": false,
            "message": "request is deprecated"
        });

        return;
    }

    next();
}

module.exports = timeValidate;