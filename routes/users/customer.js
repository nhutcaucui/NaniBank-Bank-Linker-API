var express = require('express');
var router = express.Router();
var customer = require('../../model/customers/customer');

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

   var p = await customer.get(id);
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

router.use('/get', function(req, res) {

});

router.get('/list', [userMiddleware], function (req, res) {
   let list = "";

   res.status(200).send({
       "Status": true,
       "Message": "",
       list,
   });
});

router.post('/receiver/', [userMiddleware], function (req, res) {
   res.status(200).send({
       "Status": true,
       "Message": "",
   });
});

router.get('/debt', [userMiddleware], function(req, res) {
   res.status(200).send({
       "Status": true,
       "Message": "",
   });
});

router.post('/debt', [userMiddleware], function (req, res) {
   res.status(200).send({
       "Status": true,
       "Message": "",
   });
});

router.delete('/debt', [userMiddleware], function(req, res) {
   res.status(200).send({
       "Status": true,
       "Message": "",
   });
});

router.use('/ping', function (req, res) {
   res.status(200).send("ping"); 
});


module.exports = router;