constants = require('./constants.js');


var CraftyToken = artifacts.require("CraftyToken");
var CraftyCrowdsale = artifacts.require('CraftyCrowdsale');
var ico, token;


contract('CraftyCrowdsale', function(accounts) {

    // Increase time to release token timelock
    before(async function () {
        token = await CraftyToken.deployed();
        ico = await CraftyCrowdsale.deployed();

        await web3.currentProvider.send({jsonrpc: "2.0", method: "evm_increaseTime", params: [25000000], id: 0});
        await web3.currentProvider.send({jsonrpc: "2.0", method: "evm_mine", params: [], id: 0});
    });

    /*
    it('Check if can release tokens after 6 months', async function () {
        let ico = await CraftyCrowdsale.deployed();
        await ico.releaseTeamTokens();
        await ico.releaseAdvisorTokens();
    });*/

    it("Check if can release tokens after 6 months", function() {
        return token.unpause().catch(function(e) {
            // Throw error if not paused
        }).then(function(tx) {
            return ico.releaseTeamTokens();
        }).then(function(tx) {
            return token.balanceOf(constants.teamWallet);
        }).then(function(balance) {
            assert.equal(balance.valueOf(), 1450000000*10**8, "Balance should be 1450000000.00000000");
        });
    });

});