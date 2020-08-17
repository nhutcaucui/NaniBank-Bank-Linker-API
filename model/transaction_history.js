const db = require('./db');
const tablename = "transaction_history";
const moment = require('moment');

/**
 * Return a history record by specified id
 * @param {*} id history id
 */
function get(id) {
    return db.query(`SELECT * FROM ${tablename} WHERE id = ${id}`);
}

/**
 * Return history records that are matched with specified type
 * @param {*} type type of transaction
 */
async function getByType(type) {
    return await db.query(`SELECt * FROM ${tablename} WHERE type=${type}`);
}

/**
 * Create new transaction history.
 * 
 * For specified case like draw and charge, the from account and to account is the same 
 * but different in amount, negative and positive perspective 
 * @param {*} from account id of the sender
 * @param {*} to account id of the receiver
 * @param {*} amount 
 * @param {*} message 
 */
async function create(from, to, amount, type, message) {
    let entity = {
        from_account: from,
        to_account: to,
        amount: amount,
        message: message,
        type : type,
        time:moment().unix()
    };

    return await db.addtb(tablename, entity);
}

async function all() {
    let result = await db.query(`SELECT * FROM ${tablename}`);
    return result;
}

/**
 * Return the histories that related to the specified receiver
 * @param {*} id account id of the receiver
 */
async function receiverHistory(id) {
    let receiver = await db.query(`SELECT * FROM ${tablename} WHERE from_account = ${id}`);
    return receiver;
}

/**
 * Return the histories that related to the specified sender
 * @param {*} id account id of the sender
 */
async function senderHistory(id) {
    let sender = await db.query(`SELECT * FROM ${tablename} WHERE to_account = ${id}`);
    return sender;
}

module.exports = {
    all,
    get,
    getByType,
    create,
    receiverHistory,
    senderHistory
}