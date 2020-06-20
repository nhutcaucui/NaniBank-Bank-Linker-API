const db = require('../db');
const tablename = "customer_information";

async function get(id) {
    let result =await db.query(`SELECT * FROM ${tablename} WHERE customer_id =${id}`);
    if (result instanceof Error) {
        console.log("[Database]", "get customer information", result.message);
        return result;
    }

    if (result.length == 0) {
        return new Error("Customer information not found:", id);
    }

    return result[0];
}

async function create(customer_id, email = "", name = "", phone = "") {
    let entity = {
        customer_id : customer_id,
        email : email,
        name : name, 
        phone : phone,
    };
    let result = await db.addtb(tablename, entity);
    if (result instanceof Error) {
        console.log(result);
    }

    return result;
}

async function update(customer_id, email, name, phone) {
    let result = await db.query(`UPDATE ${tablename} SET email='${email}', name='${name}', phone='${phone}' WHERE customer_id=${customer_id}`);
    return result;
}

module.exports = {
    get,
    create,
    update
}