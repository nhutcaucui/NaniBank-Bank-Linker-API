var express = require('express');
var router = express.Router();
const admins = require('../../model/admin');
const userMiddleware = require('../../middleware/userValidate');

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

   let result = await admins.login(username, password);
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

router.post('/create', [userMiddleware], async function(req, res) {
   let username = req.body["username"];
   let password = req.body["password"];

   if (username == undefined) {
      res.status(200).send({
         "Status" : false,
         "Message" : "username param is missing"
      });
      return;
   }

   if (password == undefined) {
      res.status(200).send({
         "Status" : false,
         "Message" : "password param is missing"
      });
      return;
   }

   let result = await admins.create(username, password);
   if (result instanceof Error) {
      res.status(200).send({
         "Status" : false,
         "Message" : result.message
      });
      return;
   }

   res.status(200).send({
      "Status" : true,
      "Message" : "Create new admin successfully",
      "Admin" : result
   });
});

router.use('/ping', function (req, res) {
   res.status(200).send("ping"); 
});

module.exports = router;