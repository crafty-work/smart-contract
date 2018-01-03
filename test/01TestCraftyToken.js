constants = require('./constants.js');


var CraftyToken = artifacts.require("CraftyToken");
var token;


contract('CraftyToken', function(accounts) {

    before(async function () {
        token = await CraftyToken.deployed();
    });

    it("Should check the initial supply", function() {
        return token.totalSupply().then(function(supply) {
            assert.equal(supply.valueOf(), 5000000000 * 10**8, "Initial supply should be 5.000.000.000");
        });
    });

    it("Should check if token is paused", function() {
        return token.paused().then(function(paused) {
            assert.equal(paused.valueOf(), true, "Token should start paused");
        });
    });

    it("Should check if minting is finished", function() {
        return token.mintingFinished().then(function(mintingFinished) {
            assert.equal(mintingFinished, false, "Minting should be enabled");
        });
    });

    
});
