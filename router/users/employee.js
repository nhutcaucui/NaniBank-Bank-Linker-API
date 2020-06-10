var express = require('express');
var router = express.Router();
const employees = require('../../model/employee');
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
router.use('/ping', function (req, res) {
   res.status(200).send("ping"); 
});

module.exports = router;