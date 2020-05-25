var express = require('express');
var router = express.Router();
const partnerMiddleware = require('../../middleware/partnerValidate');

router.use('/customer',partnerMiddleware, function (req, res) {

   res.status(200).send({
        "status": true,
        "message": "Here's a user"
   }); 
});

module.exports = router;