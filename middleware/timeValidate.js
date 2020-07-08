var moment = require('moment');
const config = require('config');
const upperLimit = Number(config.get('upper-limit'));
const lowerLimit = Number(config.get('lower-limit'));
function timeValidate(req, res, next) {
    let date = req.headers["timestamp"];
    if (date == undefined) {
        res.status(200).send({
            "status": false,
            "message": "timestamp header is missing"
        });

        return;
    }
    
    let send = isNaN(date) ? moment(date, "X").unix() : date;
    
    let current = moment().unix();
    let diff = current - send;
    
    if (diff > upperLimit || diff < lowerLimit)
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