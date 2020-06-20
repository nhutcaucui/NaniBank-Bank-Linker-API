const assert = require('assert');
const admins = require('../model/admin');
describe('Account', function() {
    it('create', async function(done) {
        this.timeout(10000);

        let rs = await admins.create("admin", "123456");
        rs = await admins.create("assscrom", "givememymoney");
        rs = await admins.create("anvnamsss", "givememymoney");
        rs = await admins.create("anhutcaucui", "0985956431");
        rs = await admins.create("anhutcaucui1", "0985956431");
        rs = await admins.create("anhutcaucui2", "0985956431");
        rs = await admins.create("atangkiemthusinh", "986024");
        rs = await admins.create("atankiemthusinh", "986024");
    });
})