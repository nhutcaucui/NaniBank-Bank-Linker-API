const db = require('./db');
const tablename = "transaction_history";

function get(id) {
    return db.loaddb(`SELECT * FROM ${tablename} WHERE id = '${id}'`);
}

module.exports = {
    getId: get
}