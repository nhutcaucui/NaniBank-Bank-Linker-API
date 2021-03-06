var express = require('express');
var router = express.Router();
const employees = require('../../model/employee');
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

   let result = await employees.login(username, password);
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

router.post('/create', async function(req, res) {
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

   let result = await employees.create(username, password);
   if (result instanceof Error) {
      res.status(200).send({
         "Status" : false,
         "Message" : result.message
      });
      return;
   }

   res.status(200).send({
      "Status" : true,
      "Message" : "Create new employee successfully",
      "Admin" : result
   });
});

router.delete('/', [userMiddleware], async function(req, res) {
   let username = req.body["username"];
   if (username == undefined) {
      res.status(200).send({
         "Status" : false,
         "Message" : "username param is missing"
      });
      return;
   }

   let result = await employees.remove(username);
   if (result instanceof Error) {
      res.status(200).send({
         "Status" : false,
         "Message" : result.message
      });

      return;
   }

   res.status(200).send({
      "Status":true,
      "Message" : "Delete account successfully"
   })
});

router.use('/ping', function (req, res) {
   res.status(200).send("ping"); 
});

router.get('/', [userMiddleware], async function(req,res){
   let result = await employees.get();
   if (result instanceof Error) {
      res.status(200).send({
         "Status" : false,
         "Message" : result.message
      });

      return;
   }

   res.status(200).send({
      "Status":true,
      "Employee": result
   })
})

module.exports = router;