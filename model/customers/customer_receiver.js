const db = require('../db');
const tablename = "customer_receiver";

/**
 * get list of receivers of a specified customer
 * @param {*} id customer id
 */
async function get(id) {
    let result = await db.query(`SELECT * FROM ${tablename} WHERE customer_id=${id}`);

    return result;
}

/**
 * Create new record of receiver
 * @param {*} customer_id id of customer
 * @param {*} receiver account id of the receiver
 * @param {*} remind_name 
 */
async function create(customer_id, receiver, remind_name) {
    let entity = {
        customer_id : customer_id,
        receiver: receiver,
        remind_name : remind_name
    }

    let result = await db.addtb(tablename, entity);

    return result;
}

/**
 * Remove a specified receiver from a customer
 * @param {*} customer_id customer id
 * @param {*} receiver account id of the receiver
 */
async function remove(customer_id, receiver) {
    let result = await db.query(`DELETE FROM ${tablename} WHERE customer_id=${customer_id} AND receiver=${receiver}`);
    return result;
}

module.exports = {
    get,
    create,
    remove
}