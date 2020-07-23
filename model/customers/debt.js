const db = require('../db');
const customer = require('./customer');
const tablename = "debt";

/**
 * Return a debt record by specified id
 * @param {*} id debt's id
 */
async function get(id) {
    return await db.query(`SELECT * FROM ${tablename} WHERE id=${id}`);
}

/**
 * Return debt records that are related to specified customer
 * @param {*} customer_id customer id
 */
async function getRelative(customer_id) {
    return await db.query(`SELECT * FROM ${tablename} WHERE creditor='${customer_id}' OR debtor='${customer_id}'`);
}

/**
 * Create a new debt record
 * @param {*} creditor customer id of the creditor 
 * @param {*} debtor customer id of the debtor
 * @param {*} name the debt's name
 * @param {*} amount amount of money
 * @param {*} issue_date time when the debt is expired
 */
async function create(creditor, debtor,name, amount, issue_date) {
    let creditorValidate = await customer.getById(creditor, false);
    if (creditorValidate instanceof Error) {
        console.log("[Database]", creditorValidate.message);
        return new Error(creditorValidate.message);
    }

    let debtorValidate = await customer.getById(debtor, false);
    if (debtorValidate instanceof Error) {
        console.log("[Database]", debtorValidate.message);
        return new Error(debtorValidate.message);
    }

    if (amount < 0) {
        console.log("[Database]", "Amount cannot be negative");
        return new Error("Amount cannot be negative");
    }

    let entity = {
        creditor: creditor,
        debtor: debtor,
        name : name,
        amount: amount,
        due_time: issue_date
    };

    return await db.addtb(tablename, entity);
}

/**
 * Remove the debt by specified id
 * @param {*} id 
 */
async function remove(id) {
    let entity = {
        id : id
    };
    return await db.deletetb(tablename, entity);
}

/**
 * Marking the debt as paid
 * @param {*} id 
 */
async function paid(id) {
    let condition = {
        id : id
    };

    let value = {
        description: "Paid"
    };

    return await db.updatetb(tablename, condition, value);
}

module.exports = {
    get,
    getRelative,
    create,
    remove,
    paid
}