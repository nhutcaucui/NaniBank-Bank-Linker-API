const assert = require('assert');
const moment = require('moment');
const customers = require('../model/customers/customer');
const debit = require('../model/customers/debit_account');
const saving = require('../model/customers/saving_account');
const faker = require('faker');
const customer_information = require('../model/customers/customer_information');

describe('Account', function() {
    it('create', async function(done) {
        this.timeout(10000);

        let rs = await customers.create("admin", "123456");
        rs = await customers.create("ssscrom", "givememymoney");
        rs = await customers.create("nvnamsss", "givememymoney");
        rs = await customers.create("nhutcaucui", "0985956431");
        rs = await customers.create("nhutcaucui1", "0985956431");
        rs = await customers.create("nhutcaucui2", "0985956431");
        rs = await customers.create("tangkiemthusinh", "986024");
        rs = await customers.create("tankiemthusinh", "986024");
        rs = await customers.create("streetlity", "986024");

        rs = await customers.create(faker.fake("{{name.lastName}}{{name.firstName}}"), "123456");
    });

    it('update information', async function(){
        customer_information.update(2, "nvnam.c@gmail.com", "Nguyen Vi Nam", "0966087304");
        customer_information.update(3, "nhutcaucui@gmail.com", "Le Minh Nhut", "0985399536");
        customer_information.update(4, "nhutcaucui@gmail.com", "Le Minh Nhut", "0985399536");
        customer_information.update(5, "nhutcaucui@gmail.com", "Le Minh Nhut", "0985399536");
        customer_information.update(6, "nhutcaucui@gmail.com", "Nguyen Vi Nam", "0985399536");
        customer_information.update(7, "nhutcaucui@gmail.com", "Nguyen Vi Nam", "0985399536");
        customer_information.update(8, "nhutcaucui@gmail.com", "Nguyen Vi Nam", "0985399536");
    });

});

describe('Transaction', function() {
    it('charge debit account', async function(){
        let result = await customers.getByName("nvnamsss");
        assert.equal(result instanceof Error, false);
        result = await debit.getByOwner(result.id);

        assert.equal(result instanceof Error, false);
        result = await debit.charge(result.id, 1000000);
        assert.equal(result instanceof Error, false);
    });

    it('draw debit account', async function() {
       let result = await customers.getByName("nvnamsss");
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

describe('Prepare money', function() {
    it('charge debit account', async function(){
        let result = await customers.getByName("nvnamsss");
        assert.equal(result instanceof Error, false);
        result = await debit.getByOwner(result.id);

        assert.equal(result instanceof Error, false);
        result = await debit.charge(result.id, 1000000);
        assert.equal(result instanceof Error, false);
    });
})