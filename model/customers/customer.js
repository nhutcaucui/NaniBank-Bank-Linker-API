const db = require('../db');
const tablename = "customer";
const bcrypt = require('bcryptjs');
const SALT_ROUNDS = 10;

const infos = require('./customer_information');
const messages = require('./customer_message');
const receivers = require('./customer_receiver');
const debits = require('./debit_account');
const tokens = require('./customer_token');
const jwt = require('jsonwebtoken');
const config = require('config');
const secret_key = config.get('secret-key');
const moment = require('moment');

/**
 * Return a customer record by the specified username
 * @param {*} username username of the customer
 * @param {*} relation whether if include the relative table in the result
 */
async function getByName(username, relation = true) {
    let result = await db.query(`SELECT * FROM ${tablename} WHERE username = '${username}'`);

    if (result.length == 0) return new Error("User was not exist");
    let user = result[0];

    if (relation) {
        user.info = await infos.get(user.id);
        user.message = await messages.get(user.id);
        user.receiver = await receivers.get(user.id);
        user.debit = await debits.getByCustomerId(user.id);
    }

    return user;
}

/**
 * Return a customer record by a specified id
 * @param {*} id customer id
 * @param {*} relation whether if include the relative table in the result
 */
async function getById(id, relation = true) {
    let result = await db.query(`SELECT * FROM ${tablename} WHERE id=${id}`);

    if (result.length == 0) return new Error("UserId was not exist");
    let user = result[0];

    if (relation) {
        user.info = await infos.get(user.id);
        user.message = await messages.get(user.id);
        user.receiver = await receivers.get(user.id);
        user.debit = await debits.getByCustomerId(user.id);
    }

    return user;
}

async function getInfoById(id) {
    let info = await info.get(id)
    let message = await message.get(id)
    let receiver = await receivers.get(user.id);
    let debit = await debits.getById(id)
    return {info, message, receiver, debit}
}

async function getInfoByUsername(username) {
    let result = await db.query(`SELECT * FROM ${tablename} WHERE username = '${username}'`);
    if (result.length == 0) return new Error("UserId was not exist");
    let user = result[0];

    return getInfoById(user.id);
}

/**
 * Create new record of customer
 * @param {*} username 
 * @param {*} password 
 */
async function create(username, password) {
    let user = await db.query(`SELECT * FROM ${tablename} WHERE username = '${username}'`);

    if (user.length > 0) return new Error("This username is already exist");

    let hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    let entity = {
        username: username,
        password: hashedPassword
    }
    user = await db.addtb(tablename, entity);
    tokens.create(user.insertId, await bcrypt.hash(user.insertId.toString(), 2));
    infos.create(user.insertId);
    return {id: user.insertId, username : username};
}

/**
 * Change password of a specified user
 * @param {*} username 
 * @param {*} old_password for validating
 * @param {*} new_password 
 */
async function changePassword(username, old_password, new_password) {
    let result = await getByName(username, false);

    if (result instanceof Error) return result;
    let user = result;
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

    return changed;
}

async function resetPassword(username, new_password){
    let result = await getByName(username, false);

    if (result instanceof Error) return result;
    let hashedPassword = await bcrypt.hash(new_password, SALT_ROUNDS);
    let conditionEntity = {
        id: username
    };
    let valueEntity = {
        password: hashedPassword,
    }
    let changed = await db.updatetb(tablename, conditionEntity, valueEntity);
    return changed;
}
/**
 * Login for the permission to use the service of nanibank
 * @param {*} username username of customer
 * @param {*} password passowrd of customer
 */
async function login(username, password, constraint = true) {
    let result = await getByName(username);
    if (result instanceof Error) return new Error("Username or password does not match");
    let customer = result;

    if (constraint) {
        let match = bcrypt.compare(password, customer.password);
        if (!match) return new Error("Username or password does not match");
    }

    let token = jwt.sign({id: customer.id, exp: moment().add(15, "minutes").unix()}, secret_key);
    return {token : token, customer : {
        id: customer.id,
        customer: customer
    }};
}


module.exports = {
    getByName,
    getById,
    getInfoById,
    getInfoByUsername,
    changePassword,
    resetPassword,
    create,
    login
}