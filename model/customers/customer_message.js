const db = require('../db');
const tablename = "customer_message";

function get(id) {
    return db.loaddb(`SELECT * FROM ${tablename} WHERE id = '${id}'`);
}

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
    create
}