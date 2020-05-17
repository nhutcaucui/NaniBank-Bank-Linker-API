const NodeRSA = require('node-rsa');

async function sign(content, privateKey) {
    let key = new NodeRSA(privateKey);
    let buffer = key.sign(content);

    return buffer;
}

async function verify(content, signature, privateKey) {
    let key = new NodeRSA(privateKey);
    let status = key.verify(content, signature);
    key.verify()
    return status;
}   

module.exports = {
    sign,
    verify
}