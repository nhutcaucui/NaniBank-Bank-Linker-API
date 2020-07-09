var assert = require('assert');
var fs = require('fs');
var pgp = require('../security/pgp');

var privateKey = fs.readFileSync('./security/nanibank-sec.asc').toString();
var publicKey = fs.readFileSync('./security/nanibank-pub.asc').toString();

describe('PGP', function () {
    describe('', function () {
        it('Sign and Verify', async function () {
            let content = "himom";
            let signature = await pgp.sign(content, privateKey);
            console.log(signature);
            let status = await pgp.verify(signature, publicKey);

            assert.strictEqual(status, true, "PGP Naniiiiiiiiiiiiiiii");
        });
    });
});
