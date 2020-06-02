const db = require('../db');
const tablename = "debit_account";
const balance = "balance";

function getId(id) {
    return db.loaddb(`SELECT * FROM ${tablename} WHERE id = '${id}'`);
}

function addBalance(id, money) {
    var entity = new Object();
    entity["id"] = id;
    entity["balance"] = money;
    return db.updatetbadd(tablename, balance, "id", entity);
}

module.exports = {
    getId,
    addBalance
}