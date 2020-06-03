const db = require('./db');
const tablename = "partner";

function id(id) {
    return db.loaddb(`SELECT * FROM ${tablename} WHERE id = '${id}'`);
}

function name(name) {
    return db.loaddb(`SELECT * FROM ${tablename} WHERE name = '${name}'`)
}

function add(name, publicKey, hashMethod) {
    var entity = new Object();

    entity["publicKey"] = publicKey;
    entity["name"] = name;
    entity["hashMethod"] = hashMethod;
    return db.addtb(tablename, entity);
}

module.exports = {
    id,
    name,
    add
}