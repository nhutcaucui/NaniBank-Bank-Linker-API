var express = require('express');
var router = express.Router();

router.use('/ping', function (req, res) {
   res.status(200).send("ping"); 
});

module.exports = router;