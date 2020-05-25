const db = require('./db');
const tablename = "debit_account";

function getId(id) {
    return db.loaddb(`SELECT * FROM ${tablename} WHERE id = '${id}'`);
}

module.exports = {
    getId
}