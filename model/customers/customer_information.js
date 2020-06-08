const db = require('../db');
const tablename = "customer_information";

function get(id) {
    return db.query(`SELECT * FROM ${tablename} WHERE customer_id = '${id}'`);
}


module.exports = {
    get
}