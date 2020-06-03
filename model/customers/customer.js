const db = require('../db');
const tablename = "customer";
const bcrypt = require('bcryptjs');
const SALT_ROUNDS = 10;

const info = require('./customer_information');
const message = require('./customer_message');
const receiver = require('./customer_receiver');

/**
 * Return the customer which contains all relation tables
 * */
async function get(username) {
    let user = await db.loaddb(`SELECT * FROM ${tablename} WHERE username = '${username}'`);
    user.info = await info.get(user.id);
    user.message = await message.get(user.id);
    user.receiver = await receiver.get(user.id);
    return user;
}

/**
 * Create new record of customer
 * @param {*} username 
 * @param {*} password 
 */
async function create(username, password) {
    let user = await db.loaddb(`SELECT * FROM ${tablename} WHERE username = '${username}'`);

    if (user.length > 0) return new Error("user is existed");
    let hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    let entity = {
        username: username,
        password: hashedPassword
    }

    user = await db.addtb(tablename, entity);

    return user;
}

/**
 * Change password of a specified user
 * @param {*} username 
 * @param {*} old_password for validating
 * @param {*} new_password 
 */
async function changePassword(username, old_password, new_password) {
    let user = await db.loaddb(`SELECT * FROM ${tablename} WHERE id = '${username}'`);

    if (user == undefined) return new Error("Id was not found");

    let matchOldPassword = await bcrypt.compare(old_password, user["password"]);

    if (!matchOldPassword) return new Error("Old password does not matched");

    let hashedPassword = await bcrypt.hash(new_password, SALT_ROUNDS);

    let conditionEntity = {
        id: username
    };

    let valueEntity = {
        password: hashedPassword,
    }

    let changed = await db.updatetb(tablename, conditionEntity, valueEntity);

    return changed
}


module.exports = {
    get: get,
    changePassword,
    create,
    update
}