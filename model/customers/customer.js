const db = require('../db');
const tablename = "customer";
const bcrypt = require('bcryptjs');
const SALT_ROUNDS = 10;

const info = require('./customer_information');
const message = require('./customer_message');
const receiver = require('./customer_receiver');

function getId(id) {
    return db.loaddb(`SELECT * FROM ${tablename} WHERE id = '${id}'`);
}

async function changePassword(id, old_password, new_password) {
    let user = await getId(id)[0];

    if (user == undefined) return new Error("Id was not found");

    let matchOldPassword = await bcrypt.compare(old_password, user["password"]);

    if (!matchOldPassword) return new Error("Old password does not matched");

    let hash = await bcrypt.hash(new_password, SALT_ROUNDS);
    let entity = {
        password: hash,
        id: id
    }

    await db.updatetb(tablename, 'password', 'id', entity);

    return {
        "Status" : true,
        "Message" : "Reset password successfully"
    };
}

module.exports = {
    getId,
    changePassword
}