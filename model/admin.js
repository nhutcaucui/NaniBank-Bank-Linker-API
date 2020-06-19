const db = require('./db');
const tablename = "admin";
const bcrypt = require('bcryptjs');
const SALT_ROUNDS = 10;
const jwt= require('jsonwebtoken');
const moment = require('moment');
const config = require('config');
const secret_key = config.get('secret-key');

async function getById(id) {
    let result = await db.query(`SELECT * FROM ${tablename} WHERE username = '${username}'`);
    if (result.length == 0) {
        return new Error("Id was not found");
    }

    return result[0];
}

async function getByName(username) {
    let result = await db.query(`SELECT * FROM ${tablename} WHERE username = '${username}'`);
    if (result.length == 0) {
        return new Error("Username was not found");
    }

    return result[0];
}

/**
 * Create new record of admin
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
    return {id: user.insertId, username : username};
}

async function login(username, password) {
    let result = await getByName(username);
    if (result instanceof Error) return new Error("Username or password does not match");
    let admin = result;

    // if (constraint) {
        let match = await bcrypt.compare(password, admin.password);
        if (!match) return new Error("Username or password does not match");
    //}

    let token = jwt.sign({id: admin.id, exp: moment().add(15, "minutes").unix()}, secret_key);
    return {token : token, customer : {
        id: admin.id,
        customer: admin
    }};
}

module.exports = {
    getById,
    getByName,
    create,
    login
}