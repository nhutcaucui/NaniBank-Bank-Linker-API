const assert = require('assert');
const employees = require('../model/employee');
describe('Account', function() {
    it('create', async function(done) {
        this.timeout(10000);

        let rs = await employees.create("admin", "123456");
        rs = await employees.create("essscrom", "givememymoney");
        rs = await employees.create("envnamsss", "givememymoney");
        rs = await employees.create("enhutcaucui", "0985956431");
        rs = await employees.create("enhutcaucui1", "0985956431");
        rs = await employees.create("enhutcaucui2", "0985956431");
        rs = await employees.create("etangkiemthusinh", "986024");
        rs = await employees.create("etankiemthusinh", "986024");
    });
})