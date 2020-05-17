const db = require('./db');

function id(id) {
    return db.loaddb(`SELECT * FROM partner WHERE id = '${id}'`);
}

function name(name) {
    return db.loaddb(`SELECT * FROM partner WHERE name = '${name}'`)
}

module.exports = {
    id,
    name
}