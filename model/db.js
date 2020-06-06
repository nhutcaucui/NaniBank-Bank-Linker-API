const mysql = require('mysql');
const config = require('config');
const dbConfig = config.get('Database.dbConfig');

var db = mysql.createConnection(dbConfig);
db.connect((err) => {
	if (err) {
		throw err;
	}
	console.log("[Database] - Connected");
});

/**
 * Run a specified sql query
 * @param {*} sql 
 */
function loaddb(sql) {
	return new Promise((resolve, reject) => {
		db.query(sql, (error, results, fields) => {
			if (error)
				reject(error);
			else {
				resolve(results);
			}
		});
	});
}

/**
 * 
 * @param {*} tableName 
 * @param {*} entity 
 */
function addtb(tableName, entity) {
	return new Promise((resolve, reject) => {
		var sql = `INSERT INTO ${tableName} SET ?`;
		db.query(sql, entity, (error, value) => {
			if (error)
				resolve(error);
			else {
				resolve(value.insertId);
			}
		});
	});
}

/**
 * Update rows in the table which matched the specified condition by specified value
 * @param {*} tableName name of the table
 * @param {*} conditionEntity condition for updating
 * @param {*} valueEntity value for updating
 */
function updatetb(tableName, conditionEntity, valueEntity) {
	return new Promise((resolve, reject) => {
		let sql = `UPDATE ${tableName} SET ? WHERE ?`;
		let params = [valueEntity, conditionEntity];
		console.log(params);
		db.query(sql, params, (error, value) => {
			if (error) {
				reject(error);
			}
			else {
				console.log(value.changedRows);
				resolve(value.changedRows);
			}
		});
	});
}

/**
 * Delete rows in the table by specified condition
 * @param {*} tableName name of the table
 * @param {*} conditionEntity condition for deleting
 */
function deletetb(tableName, conditionEntity) {
	return new Promise((resolve, reject) => {
		var sql = `DELETE FROM ${tableName} WHERE ?`;
		db.query(sql, conditionEntity, (error, value) => {
			if (error){
				resolve(error);
			}
			else {
				resolve(value.affectedRows);
			}
		});
	});
}

function customupdatetb(sql, entity) {
	return new Promise((resolve, reject) => {
		db.query(sql, entity, (error, value) => {
			if (error)
				reject(error);
			else {
				resolve(value.changedRows);
			}
		});
	});
}

module.exports = {
	loaddb: loaddb,
	updatetb: updatetb,
	deletetb: deletetb,
	addtb: addtb,
	customupdatetb: customupdatetb,
}