const db = require('./db');
const tablename = "partner";

async function id(id) {
    return await db.query(`SELECT * FROM ${tablename} WHERE id = '${id}'`);
}

async function all() {
    return await db.query(`SELECT * FROM ${tablename}`);
}

async function name(name) {
    let result = await db.query(`SELECT * FROM ${tablename} WHERE name = '${name}'`)
    if (result.length == 0) {
        return new Error("partner name was not found");
    }

    return result[0];
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
    all,
    name,
    add
}