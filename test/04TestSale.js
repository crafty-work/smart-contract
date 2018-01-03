constants = require('./constants.js');


var CraftyToken = artifacts.require("CraftyToken");
var CraftyCrowdsale = artifacts.require('CraftyCrowdsale');
var ico, token;


contract('CraftyCrowdsale', function(accounts) {

    before(async function () {
        token = await CraftyToken.deployed();
        ico = await CraftyCrowdsale.deployed();

        let currentTime = await web3.eth.getBlock(web3.eth.blockNumber).timestamp;
        let increaseTime = constants.saleStartTime - currentTime;
        await web3.currentProvider.send({jsonrpc: "2.0", method: "evm_increaseTime", params: [increaseTime], id: 0});
        await web3.currentProvider.send({jsonrpc: "2.0", method: "evm_mine", params: [], id: 0});
    });

    it("Should test send ether while on sale", function() {
        let amount = web3.toWei(2, "ether");
        let initialBalance;
        let finalBalance;

        return token.balanceOf(constants.account2).then(function(balance) {
            initialBalance = parseInt(balance.valueOf());
            return ico.sendTransaction({value: amount, from: constants.account2})
        }).then(function(tx) {
            return token.balanceOf(constants.account2);
        }).then(function(balance) {
            finalBalance = initialBalance + 21428571428572;
            assert.equal(balance.valueOf(), finalBalance, "Balance should be "+finalBalance);
        });
    });

    it("Should test finish crowndsale on sale", function() {
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

    it("Should test enable refund", function() {
        return ico.enableRefund().catch(function(e) {
            // Should throw exception
        });
    });
});