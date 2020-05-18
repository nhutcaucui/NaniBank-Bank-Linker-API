const db = require('./db');
const tablename = "user_information";

function getId(id) {
    return db.loaddb(`SELECT * FROM ${tablename} WHERE id = '${id}'`);
}

module.exports = {
    getId
}