const db = require('../db');
const tablename = "saving_account";

function get(id) {
    return db.loaddb(`SELECT * FROM ${tablename} WHERE id = '${id}'`);
}

module.exports = {
    getId: get
}