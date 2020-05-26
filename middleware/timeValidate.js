var moment = require('moment');

function timeValidate(req, res, next) {
    let date = req.headers["timestamp"];
    if (date == undefined) {
        res.status(200).send({
            "status": false,
            "message": "date header is missing"
        });

        return;
    }
    
    console.log(date);
    let send = moment(date, "X").unix();
    let current = moment().unix();

    let diff = current - send;
    console.log(diff);
    if (diff < 0 || diff > 30)
    {
        console.log("[Time]", "this request is over", diff, "seconds");
        res.status(200).send({
            "status": false,
            "message": "request is deprecated"
        });

        return;
    }

    next();
}

module.exports = timeValidate;