const assert = require('assert');
const moment = require('moment');
const customer = require('../model/customers/customer');
const debit = require('../model/customers/debit_account');
const saving = require('../model/customers/saving_account');

describe('Account', function() {
    it('create', async function() {
        let rs = await customer.create("admin", "123456");
        rs = await customer.create("ssscrom", "givememymoney");
        rs = await customer.create("nvnamsss", "givememymoney");
        rs = await customer.create("nhutcaucui", "0985956431");
        rs = await customer.create("nhutcaucui1", "0985956431");
        rs = await customer.create("nhutcaucui2", "0985956431");
        rs = await customer.create("tangkiemthusinh", "986024");
        rs = await customer.create("tankiemthusinh", "986024");
    });

    it('cretate debit account', async function() {
        let c = await customer.getByName("nvnamsss");
        assert.equal(c instanceof Error, false, c.message);

        let result = await debit.create(c.id);
        
        result = await debit.create(c.id);
        assert.equal(result instanceof Error, true, c.message);

    });

    it('create saving account', async function() {
        let c = await customer.getByName("nvnamsss");
        assert.equal(c instanceof Error, false, c.message);
        
        let result = await saving.create(c.id, "new pc", moment().add(1, "years").unix());
        assert.equal(result instanceof Error, false);
        result = await saving.create(c.id, "new pc", moment().add(1, "years").unix());
        assert.equal(result instanceof Error, true, c.message);
    });

    it('changePassword', function() {
        let rs = customer.changePassword("admin", "123456", "abc123");
    });
});

describe('Transaction', function() {
    it('charge debit account', async function(){
        let result = await customer.getByName("nvnamsss");
        assert.equal(result instanceof Error, false);
        result = await debit.getByOwner(result.id);

        assert.equal(result instanceof Error, false);
        result = await debit.charge(result.id, 1000000);
        assert.equal(result instanceof Error, false);
    });

    it('draw debit account', async function() {
       let result = await customer.getByName("nvnamsss");
       assert.equal(result instanceof Error, false);
       let c = result;
       result = await debit.getByOwner(c.id);
       assert.equal(result instanceof Error, false);
       let d = result;

       result = await debit.draw(d.id, 20000000);
       assert.equal(result instanceof Error, true, result.message);

       result = await debit.draw(d.id, 1000000);
       assert.equal(result instanceof Error, false);
    });
})