const db = require('../db');
const moment = require('moment');
const tablename = "saving_account";

function get(owner) {
    return db.loaddb(`SELECT * FROM ${tablename} WHERE owner = '${owner}'`);
}

/**
 * Create a new saving account for a specified customer
 * @param {*} owner 
 * @param {*} name 
 * @param {*} time 
 */
async function create(owner, name, time) {
    let result = await db.loaddb(`SELECT * FROM ${tablename} WHERE owner=${owner} AND name='${name}'`);
    if (result.length > 0) return new Error("Saving account name is duplicated");

    let entity = {
        owner: owner,
        name: name,
        balance : 0,
        created_date: moment().unix(),
        time: time,
    }
    return await db.addtb(tablename, entity);
}

/**
 * Save money to the saving account,
 * @param {*} id id of the saving account
 * @param {*} amount amount of money need to be Saved, amount must not negative
 */
async function charge(id, amount) {
    if (amount <= 0) return Error("Amount cannot be negative");

    let result = await db.loaddb(`SELECT * FROM ${tablename} WHERE id=${id}`);
    if (result.length == 0) return new Error("Id was not found");

    let account = result[0];
    account.balance += amount;

    let conditionEntity = {
        id : id
    };

    let valueEntity = {
        balance: account.balance,
    };

    return await db.updatetb(tablename, conditionEntity, valueEntity);
}
/**
 * Draw money from saving account
 * @param {*} id id of the saving account
 * @param {*} amount amount of money need to be drawed, amount must not negative
 */
async function draw(id, amount) {
    if (amount <= 0) return Error("Amount cannot be negative");

    let result = await db.loaddb(`SELECT * FROM ${tablename} WHERE id=${id}`);
    if (result.length == 0) return new Error("Id was not found");

    let account = result[0];

    let balance = parseFloat(account.balance);

    if (balance < amount) return Error("Balance is not enough");

    account.balance -= amount;

    let conditionEntity = {
        id: id
    };

    let valueEntity = {
        balance: account.balance,
    }

    return await db.updatetb(tablename, conditionEntity, valueEntity);
}


module.exports = {
    get,
    create,
    draw,
    charge
}