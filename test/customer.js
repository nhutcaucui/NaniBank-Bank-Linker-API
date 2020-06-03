var assert = require('assert');
const customer = require('../model/customers/customer');

describe('Register', function() {
    it('create', async function() {
        let rs = customer.create("admin", "123456");
    });

    it('changePassword', function() {
        let rs = customer.changePassword()
    });
})