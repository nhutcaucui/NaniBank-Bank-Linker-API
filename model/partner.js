const db = require('./db');
const tablename = "partner";

function id(id) {
    return db.loaddb(`SELECT * FROM ${tablename} WHERE id = '${id}'`);
}

function name(name) {
    return db.loaddb(`SELECT * FROM ${tablename} WHERE name = '${name}'`)
}

function add(id, name, publicKey, type) {
    var entity = new Object();
    entity["id"] = id;
    entity["publicKey"] = publicKey;
    entity["name"] = name;
    entity["type"] = type;
    return db.addtb(tablename, entity);
}

module.exports = {
    id,
    name,
    add
}