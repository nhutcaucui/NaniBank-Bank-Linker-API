const db = require('./db');
const tablename = "customer";

function getId(id) {
    return db.loaddb(`SELECT * FROM ${tablename} WHERE id = '${id}'`);
}

module.exports = {
    getId
}