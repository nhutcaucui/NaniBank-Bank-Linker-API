var express = require('express');
var router = express.Router();
const partner = require('../model/partner');

router.post('/add', function (req, res) {
    var id = req.body["id"];
    if(id == undefined){
        res.status(200).send({
            "status": false,
            "message": "FBI, show id or else"
        });
    }
   var name = req.body["name"];
    if(name == undefined){
        res.status(200).send({
            "status": false,
            "message": "Yo dawg you don't have a name?"
        });
    }

   var publicKey = req.body["publicKey"];
   if(publicKey == undefined){
        res.status(200).send({
            "status": false,
            "message": "Hey hey hey, what is the key?"
        });
    }

   var hashMethod = req.body["hashMethod"];
   if(hashMethod == undefined){
    res.status(200).send({
        "status": false,
        "message": "Dude, tell us how you hash your shit so we can contact you later"
    });
    }

    partner.add(id,name,publicKey,hashMethod);

    res.status(200).send({
        "status": true,
        "secretKey": "hi mom",
        "message": "If anyone ask, you were never here, now go away, this place is not found"
    })

});

module.exports = router;