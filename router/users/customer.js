var express = require('express');
var router = express.Router();
const customers = require('../../model/customers/customer');
const infos = require('../../model/customers/customer_information');
const receivers = require('../../model/customers/customer_receiver');
const debits = require('../../model/customers/debit_account');
const tokens = require('../../model/customers/customer_token');
const partnerMiddleware = require('../../middleware/partnerValidate');
const hashMiddleware = require('../../middleware/hashValidate');
const userMiddleware = require('../../middleware/userValidate');
const customer = require('../../model/customers/customer');

router.get('/', [userMiddleware], async function (req, res) {
   var id = req.body["id"];
   if (id == undefined) {
      res.status(200).send({
         "status": false,
         "message": "id param is missing"
      });

      return;
   }

   var p = await customers.getByName(id);
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

router.post('/', async function (req, res) {
   let username = req.body["username"];
   let password = req.body["password"];
   let name = req.body["name"];
   let email = req.body["email"];
   let phone = req.body["phone"];

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

   if (name == undefined) {
      res.status(200).send({
         "Status": false,
         "Message": "name param is missing"
      });
      return;
   }

   if (email == undefined) {
      res.status(200).send({
         "Status": false,
         "Message": "email param is missing"
      });
      return;
   } else {
      let match = email.match(/^[a-z][a-z0-9_\.]{5,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$/);
      if (match == null) {
         res.status(200).send({
            "Status": false,
            "Message": "email param is invalid"
         });
      }
   }

   if (phone == undefined) {
      res.status(200).send({
         "Status": false,
         "Message": "phone param is missing"
      });
      return;
   } else {
      let match = phone.match(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/);
      if (match == null) {
         res.status(200).send({
            "Status": false,
            "Message": "phone param is invalid"
         });

         return;
      }
   }

   let result = await customers.create(username, password);
   if (result instanceof Error) {
      res.status(200).send({
         "Status": false,
         "Message": result.message
      });

      return;
   }

   console.log(result);
   let update = await infos.update(result.id, email, name, phone);
   if (update instanceof Error) {
      res.status(200).send({
         "Status": false,
         "Message": result.message
      });
      return;
   }

   res.status(200).send({
      "Status": true,
      "Message": "Create new customer successfully",
      "User": result
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

   let result = await customers.login(username, password);
   if (result instanceof Error) {
      res.status(200).send({
         "Status": false,
         "Message": result.message
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

router.post('/receiver/', [userMiddleware], async function (req, res) {
   let customer_id = req.body["customer_id"];
   let rcver = req.body["receiver"];
   let remind_name = req.body["remind_name"];

   if (customer_id == undefined) {
      res.status(200).send({
         "Status": false,
         "Message": "customer_id param is missing"
      });

      return;
   }

   if (rcver == undefined) {
      res.status(200).send({
         "Status": false,
         "Message": "receiver param is missing"
      });

      return;
   }

   if (remind_name == undefined) {
      res.status(200).send({
         "Status": false,
         "Message": "remind_name param is missing"
      });

      return;
   }

   let result = await receivers.create(customer_id, rcver, remind_name);

   if (result instanceof Error) {
      res.status(200).send({
         "Status": false,
         "Message": result.message
      });

      return;
   }

   res.status(200).send({
      "Status": true,
      "Message": "Adding new receiver successfully",
      "Receiver": result
   });
});

/**
 * Add a debit account as an receiver
 */
router.get('/receiver', [userMiddleware], async function (req, res) {
   let customer_id = req.query["customer_id"];
   if (customer_id == undefined) {
      res.status(200).send({
         "Status": false,
         "Message": "customer_id param is missing"
      });

      return;
   }

   let result = await receivers.get(customer_id);

   if (result instanceof Error) {
      res.status(200).send({
         "Status": false,
         "Messsage": result.message
      });

      return;
   }


   res.status(200).send({
      "Status": true,
      "Message": "",
      "Receiver": result
   });
});

router.delete('/receiver', [userMiddleware], async function (req, res) {
   let customer_id = req.body["customer_id"];
   let rcver = req.body["receiver"];

   if (customer_id == undefined) {
      res.status(200).send({
         "Status": false,
         "Message": "customer_id param is missing"
      });

      return;
   }

   if (rcver == undefined) {
      res.status(200).send({
         "Status": false,
         "Message": "receiver param is missing"
      });

      return;
   }

   let result = await receivers.remove(customer_id, rcver);

   if (result instanceof Error) {
      res.status(200).send({
         "Status": false,
         "Message": result.message
      });

      return;
   }

   res.status(200).send({
      "Status": true,
      "Message": "Removing receiver successfully"
   });
});

router.post('/refresh', function (req, res) {
   let access_token = req.body["access_token"];
   let refresh_token = req.body["refresh_token"];

   if (access_token == undefined) {
      res.status(200).send({
         "Status": false,
         "Message": "access_token param is missing"
      });

      return;
   }

   if (refresh_token == undefined) {
      res.status(200).send({
         "Status": false,
         "Message": "refresh_token param is missing"
      });

      return;
   }

   let result = tokens.refresh(access_token, refresh_token);
   console.log(result.access_token);
   res.status(200).send({
      "Status": true,
      "Token": result.access_token
   })
});

router.get('/info', [userMiddleware], async function (req, res) {
   let customer_id = req.query["customer_id"]
   let username = req.query["username"]
   if (customer_id == undefined && username == undefined) {
      res.status(200).send({
         "Status" : false,
         "Message": "need customer_id or username param"
      });
      return;
   }
   let result;
   if (customer_id != undefined) {
      result = await customers.getInfoById(customer_id);
   } else {
      result = await customer.getInfoByUsername(username);
   }

   if (result instanceof Error) {
      res.status(200).send({
         "Status" : false,
         "Message" : result.message
      });
      return;
   }
   
   res.status(200).send({
      "Status" : true,
      "Message" : "Get information successfully",
      "Info" : result  
   });
})

router.post('/info', [userMiddleware], async function (req, res) {
   let customer_id = req.body["customer_id"];
   let email = req.body["email"];
   let name = req.body["name"];
   if (customer_id == undefined) {
      res.status(200).send({
         "Status": false,
         "Message": "customer_id param is missing"
      });
      return;
   }

   let result = await infos.update(customer_id, email, name);
   
   res.status(200).send({
      "Status" : true,
      "Message" : "Update information successfully"
   })
});

router.use('/ping', function (req, res) {
   res.status(200).send("ping");
});


module.exports = router;