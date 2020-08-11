const cors = {
    origin: ["http://localhost:8080","http://192.168.1.6:8080","www.lam.com","www.nguyen.com","www.nanibank.com"],
    default: "http://localhost:8080/"
  }
function corsValidate(req, res, next) {
    let origin = req.header('origin');
  if (origin == undefined) {
    res.status(200).send( {
      "Status" : false,
      "Message": "origin header is missing"
    });
    return;
  }
  origin = cors.origin.indexOf(origin.toLowerCase()) > -1 ? req.headers.origin : cors.default;
  res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Headers", '*');
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE, PATCH");
  next();
}

module.exports = corsValidate;