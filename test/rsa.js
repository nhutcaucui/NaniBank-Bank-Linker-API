var assert = require('assert');
var rsa = require('../security/rsa');
var fs = require('fs');

var privateKey = fs.readFileSync('./security/rsa.pr').toString();
var publicKey = fs.readFileSync('./security/rsa.pub').toString();

describe('RSA', function () {
    describe('', function () {
        it('Sign and Verify', async function () {
            let content = "himom";
            let signature = await rsa.sign(content, privateKey);
            let status = await rsa.verify(content, signature, publicKey);

            assert.equal(status, true, "RSA Naniiiiiiiiiiiiiiii");
        });

    });
});
