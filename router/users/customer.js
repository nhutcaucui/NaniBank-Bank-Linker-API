var express = require('express');
var router = express.Router();
const customer = require('../../model/customers/customer');
const receiver = require('../../model/customers/customer_receiver');
const partnerMiddleware = require('../../middleware/partnerValidate');
const hashMiddleware = require('../../middleware/hashValidate');
const userMiddleware = require('../../middleware/userValidate');

router.post('/get', [partnerMiddleware, hashMiddleware], async function (req, res) {
   var id = req.body["id"];
   if (id == undefined) {
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

router.post('/login', async function (req, res) {
   let username = req.body["username"];
   let password = req.body["password"];
   if (username == undefined) {
      res.status(200).send({
         "Status": false,
         "Message": "username param is missing"
      });

      return;
   }

   if (password == undefined) {
      res.status(200).send({
         "Status": false,
         "Message": "password param is missing"
      });
      return;
   }

   let result = await customer.login(username, password);
   if ( result instanceof Error) {
      res.status(200).send({
         "Status" : false,
         "Message" : result.message
      });
      return;
   }

   res.status(200).send({
      "Status": true,
      "Message": "Login successfully",
      "Token": result.token,
      "Customer": result.customer,
   });
});

router.use('/get', function (req, res) {

});

router.get('/list', [userMiddleware], function (req, res) {
   let list = "";

   res.status(200).send({
      "Status": true,
      "Message": "",
      list,
   });
});

router.post('/receiver/', [userMiddleware], async function (req, res) {
   let id = req.body["id"];
   let rcver = req.body["receiver"];
   let remind_name = req.body["remind-name"];

   let result = await receiver.create(id, recver, remind_name);

   if (result instanceof Error ) {
      res.status(200).send({
         "Status" : false,
         "Message" : result.message
      });

      return;
   }

   res.status(200).send({
      "Status": true,
      "Message": "",
      "Receiver" : result
   });
});

router.get('/receiver', [userMiddleware], async function (req, res) { 
   let id = req.query["id"];
   let result = await receiver.get(id);

   if (result instanceof Error) {
      res.status(200).send({
         "Status" :false,
         "Messsage" : result.message
      });

      return;
   }

   res.status(200).send({
      "Status" : true,
      "Message" : "",
      "Receiver" : result
   });
});

router.delete('/receiver', [userMiddleware], async function (req, res) {
   let id = req.body["id"];
   let r = req.body["receiver"];  
   let result = await receiver.remove(id, r);
   
   if (result instanceof Error) {
      res.status(200).send({
         "Status" : false,
         "Message" : result.message
      });

      return;
   }

   res.status(200).send({
      "Status" : true,
      "Message" : "Remove receiver successfully"
   });
});

router.get('/debt', [userMiddleware], function (req, res) {
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

router.delete('/debt', [userMiddleware], function (req, res) {
   res.status(200).send({
      "Status": true,
      "Message": "",
   });
});

router.use('/ping', function (req, res) {
   res.status(200).send("ping");
});


module.exports = router;