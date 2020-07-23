const db = require('./db');
const tablename = "partner_transaction_history";

/**
 * 
 * @param {*} partner_id id of the partner
 * @param {*} from debit account id of the sender
 * @param {*} to debit account id of the receiver
 */
async function get(partner_id, from, to) {
    return await db.query(`SELECT * FROM ${tablename} WHERE partner_id = ${id}`);
}

async function id(history_id) {
    return await db.query(`SELECT * FROM ${tablename} WHERE id=${history_id}`);
}

async function getAll(){
    return await db.query(`SELECT * FROM ${tablename}`);
}

async function receiverHistory(id) {
    return await db.query(`SELECT * FROM ${tablename} WHERE to_account = ${id}`);
}

async function senderHistory(id) {
    return await db.query(`SELECT * FROM ${tablename} WHERE from_account = ${id}`);
}

/**
 * Create a parter history record
 * @param {*} partner_id 
 * @param {*} from 
 * @param {*} to 
 * @param {*} amount 
 * @param {*} message 
 */
async function create(partner_id, from, to, amount, message) {
    let entity = {
        from_account : from,
        to_account : to,
        amount : amount,
        partner_id : partner_id,
        message : message,
        time : moment().unix()
    }

    return await db.addtb(tablename, entity);
}

/**
 * Statistic the total amount of money that traded with the specified partner
 * @param {*} partner_id 
 */
async function statistic(partner_id) {
    let result = await db.query(`SELECT * FROM ${tablename} WHERE partner_id=${partner_id}`);
    if (result instanceof Error) {
        console.log("[Database]", "statistc", result.message);
        return result;
    }

    let total = 0;
    for (let loop = 0; loop < result.length; loop++) {
        let history = result[loop];
        total += history.amount;        
    }

    return total;
}

module.exports = {
    get,
    getAll,
    create,
    statistic,
    receiverHistory,
    senderHistory
}