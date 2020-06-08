var otps = {};

function createOtp(key) {
    let otp = "";
    otps.key = otp;

    return otp;
}

function otpValidate(req, res, next) {
    let otp = req.body["otp"];
    if (otp == undefined) {
        res.status(401).send({
            "Status" : false,
            "Message" : "Invalid OTP"
        });
        return;
    }
    next();
}

module.exports = {
    otps,
    otpValidate,
    createOtp
}