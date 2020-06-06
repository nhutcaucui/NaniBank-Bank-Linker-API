const db = require('../db');
const tablename = "customer_message";

/**
 * Return messages of a specified customer which are in range of time
 * @param {*} id 
 * @param {*} from the minimum time that the message could be queried
 * @param {*} to the maximum time that the message could be queried
 */
async function getInRange(id, from, to) {
    let result = await db.loaddb(`SELECT * FROM ${tablename} WHERE customer_id=${id} AND time >= ${from} AND time <= ${to}`);

    return result;
}

async function get(id) {
    let result = await db.loaddb(`SELECT * FROM ${tablename} WHERE customer_id=${id}`);
    return result;
}
/**
 * Create a new record of message for a specified customer
 * @param {*} id customer id
 * @param {*} title tile of the message
 * @param {*} message content of the message
 * @param {*} time time when message is sent
 */
async function create(id, title, message, time) {
    let entity = {
        id : id,
        title : title,
        message : message,
        time : time,
    }

    return await db.addtb(tablename, entity);
}

module.exports = {
    get,
    getInRange,
    create
}