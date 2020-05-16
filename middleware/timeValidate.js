
function timeValidate(req, res, next) {
    let date = req.headers.date;
    console.log("date", req.requestTime);
    
    next();
}

module.exports = timeValidate;