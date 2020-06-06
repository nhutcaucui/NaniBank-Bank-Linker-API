const db = require('./db');
const tablename = "partner_transaction_history";

function get(partner_id, from, to) {
    return db.loaddb(`SELECT * FROM ${tablename} WHERE partner_id = ${id}`);
}

module.exports = {
    get
}