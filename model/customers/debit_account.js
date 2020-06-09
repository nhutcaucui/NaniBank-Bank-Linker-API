const db = require('../db');
const moment = require('moment');
const tablename = "debit_account";
const balance = "balance";
const history = require('../transaction_history');

async function getByOwner(owner) {
    let result = await db.query(`SELECT * FROM ${tablename} WHERE owner=${owner}`);
    if (result.length == 0) return new Error("This customer does not have any debit account");

    return result[0];
}

async function getById(id) {
    let result = await db.query(`SELECT * FROM ${tablename} WHERE id=${id}`);
    if (result.length == 0) return new Error("Debit account was not found");

    return result[0];
}

/**
 * Create a new debit account for a specified customer if there are no account available.
 * @param {*} owner customer id of the owner
 */
async function create(owner) {
    let id = 9704366600000000 + Number(owner);
    let result = await db.query(`SELECT * FROM ${tablename} WHERE id=${id}`);
    if (result.length > 0) return new Error("User already have the debit account");

    let issue_date = moment().add(3, 'years').unix();

    let entity = {
        id : id,
        owner : owner,
        balance : 0,
        issue_date : issue_date,
    }
    
    result = await db.addtb(tablename, entity);
    if (result instanceof Error) return result;

    return entity;
}

/**
 * Charge the balance of the debit account,
 * @param {*} id id of the debit account
 * @param {*} amount amount of money need to be charged, amount must not negative
 */
async function charge(id, amount, message = "Charge " + amount  + " to debit account") {
    if (amount <= 0) return Error("Amount cannot be negative");

    let result = await getById(id);
    if (result instanceof Error) return result;

    let account = result;
    account.balance = Number(amount) + Number(account.balance);

    let conditionEntity = {
        id : id
    };

    let valueEntity = {
        balance: account.balance,
    };

    history.create(id, id, amount, 0, message);
    return await db.updatetb(tablename, conditionEntity, valueEntity);
}
/**
 * Draw money from debit account
 * @param {*} id id of the debit account
 * @param {*} amount amount of money need to be drawed, amount must not negative
 */
async function draw(id, amount, message = "Draw " + amount + " from debit account") {
    if (amount <= 0) return Error("Amount cannot be negative");
    let result = await getById(id);

    if (result instanceof Error) return result;

    let account = result;
    let balance = parseFloat(account.balance);

    if (balance < amount) return Error("Balance is not enough");

    account.balance = Number(account.balance) - Number(amount);

    let conditionEntity = {
        id: id
    };

    let valueEntity = {
        balance: account.balance,
    }

    history.create(id, id, -amount, 1, message);
    return await db.updatetb(tablename, conditionEntity, valueEntity);
}

/**
 * Transfer money from an account to another
 * @param {*} fromId 
 * @param {*} toId 
 * @param {*} amount 
 * @param {*} message 
 */
async function transfer(fromId, toId, amount, message) {
    if (amount <= 0) return Error("Amount cannot be negative");
    let result = await getById(id);

    if (result instanceof Error) return result;

    let fromAccount = await getById(fromId);
    if (fromAccount instanceof Error) {
        return fromAccount;
    } 

    let toAccount = await getById(toId); 
    if (toAccount instanceof Error) {
        return toAccount;
    }

    if (fromAccount.balance < amount) {
        return new Error("Balance is not enough");
    }

    fromAccount.balance = Number(fromAccount.balance) - Number(amount);
    toAccount.balance = Number(fromAccount.balance) + Number(amount);

    db.updatetb(tablename, {id : fromAccount.id}, {balance: fromAccount.balance});
    db.updatetb(tablename, {id : toAccount.id}, {balance: toAccount.balance});
    history.create(fromAccount.id, toAccount.id, amount, 3, message);

    return {fromAccount, toAccount};
}

module.exports = {
    getByOwner,
    getById,
    create,
    draw,
    charge,
    transfer
}