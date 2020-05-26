var express = require('express');
var router = express.Router();
const partnerMiddleware = require('../../middleware/partnerValidate');
const hashMiddleware = require('../../middleware/hashValidate');

router.post('/customer',[partnerMiddleware,hashMiddleware] , function (req, res) {

   res.status(200).send({
        "status": true,
        "message": "Here's a user"
   }); 
});

module.exports = router;