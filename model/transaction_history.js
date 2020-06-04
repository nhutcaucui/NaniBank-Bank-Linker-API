const db = require('./db');
const tablename = "transaction_history";

function get(id) {
    return db.loaddb(`SELECT * FROM ${tablename} WHERE id = ${id}`);
}

/**
 * Return the histories that related to the specified receiver
 * @param {*} id customer id of the receiver
 */
async function receiverHistory(id) {
    let receiver = await db.loaddb(`SELECT * FROM ${tablename} WHERE from_account = ${id}`);
    return receiver;
}

/**
 * Return the histories that related to the specified sender
 * @param {*} id customer id of the sender
 */
async function senderHistory(id) {
    let sender = await db.loaddb(`SELECT * FROM ${tablename} WHERE to_account = ${id}`);
    return sender;
}

module.exports = {
    get,
    receiverHistory,
    senderHistory
}