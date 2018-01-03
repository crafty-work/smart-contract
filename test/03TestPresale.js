constants = require('./constants.js');


var CraftyToken = artifacts.require("CraftyToken");
var CraftyCrowdsale = artifacts.require('CraftyCrowdsale');
var ico, token;


contract('CraftyCrowdsale', function(accounts) {

    before(async function () {
        token = await CraftyToken.deployed();
        ico = await CraftyCrowdsale.deployed();

        let currentTime = await web3.eth.getBlock(web3.eth.blockNumber).timestamp;
        let increaseTime = constants.preSaleStartTime - currentTime;
        await web3.currentProvider.send({jsonrpc: "2.0", method: "evm_increaseTime", params: [increaseTime], id: 0});
        await web3.currentProvider.send({jsonrpc: "2.0", method: "evm_mine", params: [], id: 0});
    });
    
    it("Should test change exchange rate on pre-sale", function() {
        return ico.setRate(12345, {from: constants.owner}).catch(function(tx) {
            // Should throw exception
            return ico.rate();
        }).then(function(rate) {
            assert.equal(rate.valueOf(), constants.rate, "Rate should be "+constants.rate);
        });
    });
    

    it("Should test send below minimum on pre-sale", function() {
        let amount = web3.toWei(1, "ether");
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

    it("Should test send above minimum on pre-sale", function() {
        let amount = web3.toWei(15, "ether");
        let initialBalance;
        let finalBalance;

        return token.balanceOf(constants.account1).then(function(balance) {
            initialBalance = parseInt(balance.valueOf());
            return ico.sendTransaction({value: amount, from: constants.account1});
        }).then(function(tx) {
            return token.balanceOf(constants.account1);
        }).then(function(balance) {
            finalBalance = initialBalance + 168750000000000;
            assert.equal(balance.valueOf(), finalBalance, "Balance should be "+finalBalance);
        });
    });

    it("Should test send above the maximum bonus on pre-sale", function() {
        let amount = web3.toWei(51, "ether");
        let initialBalance;
        let finalBalance;

        return token.balanceOf(constants.account1).then(function(balance) {
            initialBalance = parseInt(balance.valueOf());
            return ico.sendTransaction({value: amount, from: constants.account1});
        }).then(function(tx) {
            return token.balanceOf(constants.account1);
        }).then(function(balance) {
            finalBalance = initialBalance + 655714285714293;
            assert.equal(balance.valueOf(), finalBalance, "Balance should be "+finalBalance);
        });
    });


    it("Should check the number of issued tokens", function() {
        return ico.issuedTokens().then(function(issued) {
            assert.equal(issued.valueOf(), 824464285714293, "Issued tokens should be 824464285714293")
        });
    });

    it("Should test finish crowndsale on pre-sale", function() {
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

    it("Should test generate tokens", function() {
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

    it("Should test generate tokens with wrong owner", function() {
        let amount = 54321;
        let initialBalance;
        let finalBalance;

        return token.balanceOf(constants.account4).then(function(balance) {
            initialBalance = parseInt(balance.valueOf());
            return ico.generateTokens(constants.account4, amount, {from: constants.account2});
        }).catch(function(e) {
            // Should throw exception
            return token.balanceOf(constants.account4);
        }).then(function(balance) {
            finalBalance = initialBalance + 0;
            assert.equal(balance.valueOf(), finalBalance, "Balance should be "+finalBalance);
        });
    });

    it("Should test enable refund", function() {
        return ico.enableRefund().catch(function(e) {
            // Should throw exception
        });
    });
});