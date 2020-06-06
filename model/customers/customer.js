const db = require('../db');
const tablename = "customer";
const bcrypt = require('bcryptjs');
const SALT_ROUNDS = 10;

const info = require('./customer_information');
const message = require('./customer_message');
const receiver = require('./customer_receiver');
const jwt = require('jsonwebtoken');
/**
 * Return the customer which contains all relation tables
 * */
async function get(username) {
    let result = await db.loaddb(`SELECT * FROM ${tablename} WHERE username = '${username}'`);

    if (result.length == 0) return new Error("User was not exist");
    let user = result[0];

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

    if (user instanceof Error) return user;

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
    let result = await db.loaddb(`SELECT * FROM ${tablename} WHERE username = '${username}'`);

    if (result instanceof Error) return result;
    let user = result[0];

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

/**
 * Login for the permission to use the service of nanibank
 * @param {*} username username of customer
 * @param {*} password passowrd of customer
 */
async function login(username, password) {
    let customer = await db.loaddb(`SELECT * FROM ${tablename} WHERE username= '${username}'`);
    if (customer.length == 0) return new Error("Username or password does not match");
    customer = customer[0];

    let match = bcrypt.compare(password, customer.password);
    if (!match) return new Error("Username or password does not match");

    let token = jwt.sign({id: customer.id}, 'himom');
    return {token : token, customer : customer};
}

module.exports = {
    get,
    changePassword,
    create,
    login
}