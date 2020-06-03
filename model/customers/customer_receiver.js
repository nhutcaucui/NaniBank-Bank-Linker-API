const db = require('../db');
const tablename = "customer_receiver";

function get(id) {
    return db.loaddb(`SELECT * FROM ${tablename} WHERE id = '${id}'`);
}

/**
 * Create new record of receiver
 * @param {*} id id of customer
 * @param {*} receiver customer id of the receiver
 * @param {*} remind_name 
 */
function create(id, receiver, remind_name) {
    let entity = {
        id : id,
        receiver: receiver,
        remind_name : remind_name
    }

    return db.addtb(tablename, entity);
}

/**
 * Remove a specified receiver from a customer
 * @param {*} id 
 * @param {*} receiver 
 */
function remove(id, receiver) {
    let entity = {
        id: id,
        receiver : receiver,
    };

    return db.deletetb(tablename, entity);
}

module.exports = {
    get,
    create,
    remove
}