var express = require('express');
var router = express.Router();
var customer = require('../../model/customer');

const partnerMiddleware = require('../../middleware/partnerValidate');
const hashMiddleware = require('../../middleware/hashValidate');

router.post('/get',[partnerMiddleware,hashMiddleware] , async function (req, res) {
   var id = req.body["id"];
   if(id == undefined){
      res.status(200).send({
         "status": false,
         "message": "id param is missing"
    }); 

    return;
   }

   var p = await customer.getId(id);
   if (p.length == 0) {
		res.status(200).send({
			"status": false,
			"message": "Customer doesn't exist"
		});

		return;
   }
   
   res.status(200).send({
        "status": true,
        "message": "Here's a customer",
        "id": p[0]["id"],
        "name": p[0]["name"]
   }); 
});

router.use('/ping', function (req, res) {
   res.status(200).send("ping"); 
});

module.exports = router;