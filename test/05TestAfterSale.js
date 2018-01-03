constants = require('./constants.js');


var CraftyToken = artifacts.require("CraftyToken");
var CraftyCrowdsale = artifacts.require('CraftyCrowdsale');
var ico, token;


contract('CraftyCrowdsale', function(accounts) {

    before(async function () {
        token = await CraftyToken.deployed();
        ico = await CraftyCrowdsale.deployed();

        let currentTime = await web3.eth.getBlock(web3.eth.blockNumber).timestamp;
        let increaseTime = constants.saleEndTime - currentTime;
        await web3.currentProvider.send({jsonrpc: "2.0", method: "evm_increaseTime", params: [increaseTime], id: 0});
        await web3.currentProvider.send({jsonrpc: "2.0", method: "evm_mine", params: [], id: 0});
    });


    it("Should test send ether after sale", function() {
        let amount = web3.toWei(1, "ether");
        let initialBalance;
        let finalBalance;

        return token.balanceOf(constants.account2).then(function(balance) {
            initialBalance = parseInt(balance.valueOf());
            return ico.sendTransaction({value: amount, from: constants.account2})
        }).catch(function(e) {
            // Should throw exception
            return token.balanceOf(constants.account2);
        }).then(function(balance) {
            finalBalance = initialBalance + 0;
            assert.equal(balance.valueOf(), finalBalance, "Balance should be "+finalBalance);
        });
    });

    it("Should test change the ownership of ico", function() {
        return ico.transferOwnership(constants.account1, {from: constants.owner}).then(function(tx) {
            return ico.owner();
        }).then(function(owner) {
            assert.equal(owner, constants.account1, "Owner should be "+constants.account1);
        }).then(function() {
            return ico.transferOwnership(constants.owner, {from: constants.account1});
        }).then(function(tx) {
            return ico.owner();
        }).then(function(owner) {
            assert.equal(owner, constants.owner, "Owner should be "+constants.owner);
        });
    });

    it("Should test generate tokens before pre-sale", function() {
        let amount = 54321;
        let initialBalance;
        let finalBalance;

        return token.balanceOf(constants.account4).then(function(balance) {
            initialBalance = parseInt(balance.valueOf());
            return ico.generateTokens(constants.account4, amount);
        }).catch(function(e) {
            // Should throw exception
            return token.balanceOf(constants.account4);
        }).then(function(balance) {
            finalBalance = initialBalance + 0;
            assert.equal(balance.valueOf(), finalBalance, "Balance should be "+finalBalance);
        });
    });

    it("Should test enable refund before finish crowdsale", function() {
        return ico.enableRefund().catch(function(e) {
            // Should throw exception
        });
    });

    it("Should test finish crowdsale without permission", function() {
        return ico.finishCrowdsale({from: constants.account1}).catch(function(e) {
            // Should throw exception
        });
    });

    it("Should test finish crowndsale after sale", function() {
        return ico.finishCrowdsale().then(function(tx) {
            return token.mintingFinished();
        }).then(function(mintingFinished) {
            assert.equal(mintingFinished, true, "Minting should be disabled");
        });
    });

    it("Should test enable refund after finish crowdsale", function() {
        return ico.enableRefund();
    });
    
});