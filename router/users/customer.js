var express = require('express');
var router = express.Router();
const customer = require('../../model/customers/customer');
const receiver = require('../../model/customers/customer_receiver');
const debit = require('../../model/customers/debit_account');
const partnerMiddleware = require('../../middleware/partnerValidate');
const hashMiddleware = require('../../middleware/hashValidate');
const userMiddleware = require('../../middleware/userValidate');

router.get('/', [userMiddleware], async function (req, res) {
   var id = req.body["id"];
   if (id == undefined) {
      res.status(200).send({
         "status": false,
         "message": "id param is missing"
      });

      return;
   }

   var p = await customer.getByName(id);
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

router.post('/', async function(req, res) {
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

   let result = await customer.create(username, password);
   if (result instanceof Error) {
      res.status(200).send({
         "Status" : false,
         "Message" : result.message
      });

      return;
   }

   res.status(200).send({
      "Status" : true,
      "Message" : "Create new customer successfully",
      "User" : result
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
   let customer_id = req.body["customer_id"];
   let rcver = req.body["receiver"];
   let remind_name = req.body["remind_name"];

   if (customer_id == undefined) {
      res.status(200).send({
         "Status" : false,
         "Message" : "customer_id param is missing"
      });

      return;
   }

   if (rcver == undefined) {
      res.status(200).send({
         "Status" : false,
         "Message" : "receiver param is missing"
      });

      return;
   }

   if (remind_name == undefined) {
      res.status(200).send({
         "Status" : false,
         "Message" : "remind_name param is missing"
      });

      return;
   }

   let result = await receiver.create(customer_id, rcver, remind_name);

   if (result instanceof Error ) {
      res.status(200).send({
         "Status" : false,
         "Message" : result.message
      });

      return;
   }

   res.status(200).send({
      "Status": true,
      "Message": "Adding new receiver successfully",
      "Receiver" : result
   });
});

/**
 * Add a debit account as an receiver
 */
router.get('/receiver', [userMiddleware], async function (req, res) { 
   let customer_id = req.query["customer_id"];
   if (customer_id == undefined) {
      res.status(200).send({
         "Status" : false,
         "Message" : "customer_id param is missing"
      });

      return;
   }
   
   let result = await receiver.get(customer_id);

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
   let customer_id = req.body["customer_id"];
   let rcver = req.body["receiver"];  

   if (customer_id == undefined) {
      res.status(200).send({
         "Status" : false,
         "Message" : "customer_id param is missing"
      });

      return;
   }

   if (rcver == undefined) {
      res.status(200).send({
         "Status" : false,
         "Message" : "receiver param is missing"
      });

      return;
   }

   let result = await receiver.remove(customer_id, rcver);
   
   if (result instanceof Error) {
      res.status(200).send({
         "Status" : false,
         "Message" : result.message
      });

      return;
   }

   res.status(200).send({
      "Status" : true,
      "Message" : "Removing receiver successfully"
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