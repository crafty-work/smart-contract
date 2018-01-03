constants = require('./constants.js');


var CraftyToken = artifacts.require("CraftyToken");
var CraftyCrowdsale = artifacts.require('CraftyCrowdsale');
var ico, token;


contract('CraftyCrowdsale', function(accounts) {

    before(async function () {
        token = await CraftyToken.deployed();
        ico = await CraftyCrowdsale.deployed();

        let currentTime = await web3.eth.getBlock(web3.eth.blockNumber).timestamp;
        let increaseTime = 1519000000 - currentTime;
        await web3.currentProvider.send({jsonrpc: "2.0", method: "evm_increaseTime", params: [increaseTime], id: 0});
        await web3.currentProvider.send({jsonrpc: "2.0", method: "evm_mine", params: [], id: 0});
    });

    beforeEach(async function () {
        let increaseTime = 1000000;
        await web3.currentProvider.send({jsonrpc: "2.0", method: "evm_increaseTime", params: [increaseTime], id: 0});
        await web3.currentProvider.send({jsonrpc: "2.0", method: "evm_mine", params: [], id: 0});
    });

    
    it("Should test on pre-sale", function() {
        //console.log(web3.eth.getBlock(web3.eth.blockNumber).timestamp);
    });

    it("Should test after pre-sale", function() {
        //console.log(web3.eth.getBlock(web3.eth.blockNumber).timestamp);
    });

    it("Should test on sale", function() {
        //console.log(web3.eth.getBlock(web3.eth.blockNumber).timestamp);
        let amount = web3.toWei(2, "ether");
        let initialBalance;
        let finalBalance;

        return token.balanceOf(constants.account3).then(function(balance) {
            initialBalance = parseInt(balance.valueOf());
            return ico.sendTransaction({value: amount, from: constants.account3})
        }).then(function(tx) {
            return token.balanceOf(constants.account3);
        }).then(function(balance) {
            finalBalance = initialBalance + 21428571428572;
            assert.equal(balance.valueOf(), finalBalance, "Balance should be "+finalBalance);
        }).then(function() {
            return ico.pause();
        }).then(function(tx) {
            return ico.unpause();
        });
    });

    it("Should test after sale", function() {
        //console.log(web3.eth.getBlock(web3.eth.blockNumber).timestamp);
        let wei = web3.toWei(5, "ether");

        return ico.sendTransaction({value: wei, from: constants.owner}).then(function(tx) {
            return ico.receivedFrom(constants.account4);
        }).then(function(amount) {
            assert.equal(amount.valueOf(), 0, "Amount to refund should be 0 ether");
            return ico.receivedFrom(constants.account3);
        }).then(function(amount) {
            assert.equal(amount.valueOf(), 2000000000000000000, "Amount to refund should be 2 ether");
            return ico.finishCrowdsale();
        }).then(function(tx) {
            return ico.enableRefund();
        }).then(function(tx) {
            return ico.claimRefund({from: constants.account3});
        }).then(function(tx) {
            return ico.receivedFrom(constants.account3);
        }).then(function(amount) {
            let remainingBalance = web3.eth.getBalance(ico.address).valueOf();
            assert.equal(amount.valueOf(), 0, "Amount to refund should be 0");
            assert.equal(remainingBalance, 3000000000000000000, "Balance on ico should be 3 ether");
            return ico.reclaimEther();
        }).then(function(tx) {
            let remainingBalance = web3.eth.getBalance(ico.address).valueOf();
            assert.equal(remainingBalance, 0, "Balance on ico should be 0 ether");
        });
    });

});