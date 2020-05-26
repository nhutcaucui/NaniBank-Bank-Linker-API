const NodeRSA = require('node-rsa');

async function sign(content, privateKey) {
    let key = new NodeRSA(privateKey);
    let buffer = key.sign(content);

    return buffer;
}

async function verify(content, signature, publicKey) {
    let key = new NodeRSA(publicKey);
    let status = key.verify(content, signature);
    return status;
}   

module.exports = {
    sign,
    verify
}