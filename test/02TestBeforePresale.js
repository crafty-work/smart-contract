constants = require('./constants.js');


var CraftyToken = artifacts.require("CraftyToken");
var CraftyCrowdsale = artifacts.require('CraftyCrowdsale');
var ico, token;


contract('CraftyCrowdsale', function(accounts) {

    before(async function () {
        token = await CraftyToken.deployed();
        ico = await CraftyCrowdsale.deployed();
    });

    
    it("Should test change exchange rate before pre-sale", function() {
        return ico.setRate(12345, {from: constants.owner}).then(function(tx) {
            return ico.rate();
        }).then(function(rate) {
            assert.equal(rate.valueOf(), 12345, "Rate should be 12345");
            return ico.setRate(constants.rate);
        }).then(function(tx) {
            return ico.rate();
        }).then(function(rate) {
            assert.equal(rate.valueOf(), constants.rate, "Rate should be "+constants.rate);
        });
    });

    it("Should check the number of issued tokens", function() {
        return ico.issuedTokens().then(function(issued) {
            assert.equal(issued.valueOf(), 0, "Issued tokens should be 0");
        });
    });

    it("Should test finish crowndsale before pre-sale", function() {
        return ico.finishCrowdsale().catch(function(e) {
            // Should throw exception
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

    it("Should test call function set wallet", function() {
        return ico.setWallets(constants.etherWallet, constants.teamWallet, constants.advisorWallet, constants.bountyWallet, constants.fundWallet).catch(function(e) {
            // Should throw exception
        });
    });

    it("Should test send before pre-sale", function() {
        let amount = web3.toWei(17, "ether");
        let initialBalance;
        let finalBalance;

        return token.balanceOf(constants.account1).then(function(balance) {
            initialBalance = parseInt(balance.valueOf());
            return ico.sendTransaction({value: amount, from: constants.account1});
        }).catch(function(tx) {
            // Should throw exception
            return token.balanceOf(constants.account1);
        }).then(function(balance) {
            finalBalance = initialBalance + 0;
            assert.equal(balance.valueOf(), finalBalance, "Balance should be "+finalBalance);
        });
    });

    it("Should test generate tokens before pre-sale", function() {
        let amount = 54321;
        let initialBalance;
        let finalBalance;

        return token.balanceOf(constants.account4).then(function(balance) {
            initialBalance = parseInt(balance.valueOf());
            return ico.generateTokens(constants.account4, amount);
        }).then(function(tx) {
            return token.balanceOf(constants.account4);
        }).then(function(balance) {
            finalBalance = initialBalance + amount;
            assert.equal(balance.valueOf(), finalBalance, "Balance should be "+finalBalance);
        });
    });

    it("Should test enable refund", function() {
        return ico.enableRefund().catch(function(e) {
            // Should throw exception
        });
    });

});