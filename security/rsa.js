const NodeRSA = require('node-rsa');

function sign(content, privateKey) {
    let key = new NodeRSA(privateKey);
    let buffer = key.sign(content);

    return buffer;
}

function verify(content, signature, privateKey) {
    // const key = new NodeRSA({b: 2048});
    let key = new NodeRSA(privateKey);
    // key.importKey(privateKey, 'pkcs1');
    let status = key.verify(content, signature);

    return status;
}   

module.exports = {
    sign,
    verify
}