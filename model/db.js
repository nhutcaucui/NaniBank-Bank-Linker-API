var db = require('./index').mysql;

function loaddb(sql){
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

function addtb(tableName, entity){
    return new Promise((resolve, reject) => {
      var sql = `INSERT INTO ${tableName} SET ?`;
      db.query(sql, entity, (error, value) => {
        if (error)
          reject(error);
        else {
          resolve(value.insertId);
        }
      });
    });
}

function updatetb(tableName, updateField, conditionField, entity){
    return new Promise((resolve, reject) => {
    let sql = `UPDATE ${tableName} SET ${updateField}=? WHERE ${conditionField}=?`;
    console.log("update", entity[updateField]);
	  let params = [entity[updateField], entity[conditionField]];
      db.query(sql, params, (error, value) => {
        if (error){
			reject(error);
		}
        else {
          resolve(value.changedRows);
        }
      });
    });
}

function updatetbbyid(tableName, id, entity){
  return new Promise((resolve, reject) => {
  let sql = `UPDATE ${tableName} SET ? WHERE ID=${id}`;
    db.query(sql, entity, (error, value) => {
      if (error){
    reject(error);
  }
      else {
        resolve(value.changedRows);
      }
    });
  });
}

function deletetb(tableName, idField, id){
    return new Promise((resolve, reject) => {
      var sql = `DELETE FROM ${tableName} WHERE ${idField} = ?`;
      db.query(sql, id, (error, value) => {
        if (error)
          reject(error);
        else {
          resolve(value.affectedRows);
        }
      });
    });
}

function customupdatetb(sql, entity){
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

module.exports ={
    loaddb: loaddb,
    updatetb: updatetb,
    deletetb: deletetb,
    addtb: addtb,
    updatetbbyid:updatetbbyid,
    customupdatetb:customupdatetb,
}