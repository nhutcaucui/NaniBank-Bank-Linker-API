const db = require('./db');
const tablename = "partner";

function id(id) {
    return db.loaddb(`SELECT * FROM ${tablename} WHERE id = '${id}'`);
}

function name(name) {
    return db.loaddb(`SELECT * FROM ${tablename} WHERE name = '${name}'`)
}

module.exports = {
    id,
    name
}