const db = require('./db');
const tablename = "partner";

async function id(id) {
    return await db.query(`SELECT * FROM ${tablename} WHERE id = '${id}'`);
}

async function name(name) {
    return await db.query(`SELECT * FROM ${tablename} WHERE name = '${name}'`)
}

async function add(name, publicKey, hashMethod) {
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