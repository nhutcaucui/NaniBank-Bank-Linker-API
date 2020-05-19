var express = require('express');
var router = express.Router();

router.use('/meo', function (req, res) {
   res.status(200).send("meo"); 
});

module.exports = router;