const assert = require('assert');

describe('test', function () {
    it('phone regex', async function () {
        let phone = "0966087304";
        let match = phone.match(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/);

        assert.equal(match != null, true, "reiceive " + match);
    });

    it('email regex', async function () {
        let email = "nvnam.c@gmail.com";
        let wemail = "nvnam.c";
        let match = email.match(/^[a-z][a-z0-9_\.]{5,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$/);

        assert.equal(match != null, true, "receive " + match);
        match = wemail.match(/^[a-z][a-z0-9_\.]{5,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$/);
        assert.equal(match == null, true, "receive " + match);
    });
});