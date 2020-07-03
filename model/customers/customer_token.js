const db = require('../db');
const tablename = "customer_token";
const jwt = require('jsonwebtoken');
const moment = require('moment');
const secret_key = "hi mom";

function get(id) {
    return db.query(`SELECT * FROM ${tablename} WHERE customer_id = '${id}'`);
}

/**
 * Create a new record for customer token
 * @param {*} id customer id
 * @param {*} refresh_token refresh token of the user
 */
async function create(id, refresh_token) {
    let entity = {
        customer_id : id,
        access_token : "",
        refresh_token : refresh_token
    }

    return await db.addtb(tablename, entity);
}

async function refresh(access_token, refresh_token) {
    let result = await db.query(`SELECT * FROM ${tablename} WHERE refresh_token='${refresh_token}' AND access_token='${access_token}'`);
    if (result instanceof Error) return result;

    let token = jwt.sign({id: result.id, exp: moment().add(15, "minutes").unix()}, secret_key);

    let conditionEntity = {refresh_token: refresh_token};
    let valueEntity = {access_token: token};
    db.updatetb(tablename, conditionEntity, valueEntity);
    console.log(token+ "in model");
    return token;
}

module.exports = {
    get,
    refresh,
    create
}