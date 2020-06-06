var moment = require('moment');
const limit = 10;
function timeValidate(req, res, next) {
    let date = req.headers["timestamp"];
    if (date == undefined) {
        res.status(200).send({
            "status": false,
            "message": "timestamp header is missing"
        });

        return;
    }
    
    console.log(date);
    let send = moment(date, "X").unix();
    let current = moment().unix();
    console.log(current);
    let diff = current - send;
    if (diff > limit || diff < -2)
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