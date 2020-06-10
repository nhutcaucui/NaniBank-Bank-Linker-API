const assert = require('assert');
const moment = require('moment');
const receivers = require('../model/customers/customer_receiver');
const customers = require('../model/customers/customer');

describe('Customer relation', function() {
    it('create receiver', async function() {
        let customer_id = 1;
        let r = 9704366600000004;
        let result = await receivers.create(customer_id, r, "account 3");
    });

    it('remove receiver', async function(){
        let customer_id = 1;
        let r = 9704366600000004;
        let result = await receivers.remove(customer_id, r);
    });
});