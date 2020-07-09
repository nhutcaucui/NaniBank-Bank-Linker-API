const openpgp = require('openpgp');
const fs = require('fs');
const prkey = fs.readFileSync('./security/nanibank-sec.asc').toString();
const pukey = fs.readFileSync('./security/nanibank-pub.asc').toString();
const passphrase = `himom`;

//Sign the content by nanibank private key
async function sign(content) {
    const { keys: [privateKey] } = await openpgp.key.readArmored(prkey);
    await privateKey.decrypt(passphrase);
    // let prk = privateKey.export({type: "pkcs1", format: "pem"});
    // let puk = publicKey.export({type: "pkcs1",format: "pem"});
    const { data: cleartext } = await openpgp.sign({
        message: openpgp.cleartext.fromText(content),
        privateKeys: [privateKey]
    });

    return cleartext;
}

async function verify(content, publicKey) {
    try {
        let { keys: [key] } = await openpgp.key.readArmored(publicKey);
        let verified = await openpgp.verify({
            message: await openpgp.cleartext.readArmored(content),
            publicKeys: [key]
        });

        let { valid } = verified.signatures[0];

        if (valid) {
            console.log('signed by key id ' + verified.signatures[0].keyid.toHex());
        } else {
            throw new Error('signature could not be verified');
        }

        return valid;
    } catch (e) {
        return false;
    }
};

async function detachedVerify(detachedSignature, pukey) {
    try {
        const verified = await openpgp.verify({
            message: await openpgp.message.fromText("himom"),
            signature: await openpgp.signature.readArmored(
                new Buffer(detachedSignature, "base64").toString("ascii")
            ),
            publicKeys: (await openpgp.key.readArmored(pukey)).keys, // for verification
        });
        const { valid } = verified.signatures[0];

        if (valid) {
            console.log(
                "Signed by key id " + verified.signatures[0].keyid.toHex()
            );
            return Promise.resolve({ message: "Signature verified" });
        } else {
            return Promise.reject("Signature could not be verified");
        }
    } catch (e) {
        return Promise.reject("Signature could not be verified");
    }
};

module.exports = {
    sign,
    verify,
    detachedVerify
}