const db = require('../db');
const moment = require('moment');
const tablename = "debit_account";
const balance = "balance";

function get(owner) {
    return db.loaddb(`SELECT * FROM ${tablename} WHERE owner = '${owner}'`);
}

/**
 * Create a new debit account for a specified customer if there are no account available.
 * @param {*} owner customer id of the owner
 */
async function create(owner) {
    let id = 9704366600000000 + owner;
    let result = await db.loaddb(`SELECT * FROM ${tablename} WHERE id=${id}`);
    if (result.length > 0) return new Error("User already have the debit account");
    
    let issue_date = moment().add(3, 'years').unix();

    let entity = {
        id : id,
        owner : owner,
        balance : 0,
        issue_date : issue_date,
    }

    return await db.addtb(tablename, entity);
}

/**
 * Charge the balance of the debit account,
 * @param {*} id id of the debit account
 * @param {*} amount amount of money need to be charged, amount must not negative
 */
async function charge(id, amount) {
    if (amount <= 0) return Error("Amount cannot be negative");

    let account = await get(id);
    if (account.length == 0) return new Error("Id was not found");

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
 * Draw money from debit account
 * @param {*} id id of the debit account
 * @param {*} amount amount of money need to be drawed, amount must not negative
 */
async function draw(id, amount) {
    if (amount <= 0) return Error("Amount cannot be negative");
    let account = await get(id)

    if (account.length == 0) return new Error("Id was not found");

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
    create,
    get,
    draw,
    charge,
}