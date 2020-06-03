const db = require('../db');
const tablename = "saving_account";

function get(id) {
    return db.loaddb(`SELECT * FROM ${tablename} WHERE id = '${id}'`);
}

/**
 * Create a new saving account for a specified customer
 * @param {*} owner 
 * @param {*} name 
 * @param {*} time 
 */
function create(owner, name, time) {
    let account = db.loaddb(`SELECT * FORM ${tablename} WHERE owner = '${owner}' AND name = '${name}'`);

    if (account.length > 0) return new Error("Saving account name is duplicated");

    let entity = {
        owner: owner,
        name: name,
        time: time,
    }
    return await db.addtb(tablename, entity);
}

/**
 * Save money to the saving account,
 * @param {*} id id of the saving account
 * @param {*} amount amount of money need to be Saved, amount must not negative
 */
function charge(id, amount) {
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
 * Draw money from saving account
 * @param {*} id id of the saving account
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
    get,
    create,
    draw,
    charge
}