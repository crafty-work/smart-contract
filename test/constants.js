// Test accounts
var owner = "0x627306090abab3a6e1400e9345bc60c78a8bef57";
var account1 = "0x2191ef87e392377ec08e7c08eb105ef5448eced5";
var account2 = "0x0f4f2ac550a1b4e2280d04c21cea7ebd822934b5";
var account3 = "0x6330a553fc93768f612722bb8c2ec78ac90b3bbc";
var account4 = "0x5aeda56215b167893e80b4fe645ba6d5bab767de";

var rate = 10714285714286;

// Wallets
var etherWallet = "0xf17f52151ebef6c7334fad080c5704d77216b732";
var teamWallet = "0xc5fdf4076b8f3a5357c5e395ab970b5b54098fef";
var advisorWallet = "0x821aea9a577a9b44299b9c15c88cf3087f3b5544";
var bountyWallet = "0x0d1d4e623d10f9fba5db95830f7d3839406c6af2";
var fundWallet = "0x2932b7a2355d6fecc4b5c0b6bd44cc31df247a2e";

// Crowdsale date
var preSaleStart = new Date("March 2, 2018 14:13:20 GMT"); //1520000000
var preSaleEnd = new Date("March 14, 2018 04:00:00 GMT"); //1521000000
var saleStart = new Date("March 25, 2018 17:46:40 GMT"); //1522000000
var saleEnd = new Date("April 6, 2018 07:33:20 GMT"); //1523000000

// Crowdsale time
var preSaleStartTime = Math.round(preSaleStart.getTime()/1000.0);
var preSaleEndTime = Math.round(preSaleEnd.getTime()/1000.0);
var saleStartTime = Math.round(saleStart.getTime()/1000.0);
var saleEndTime = Math.round(saleEnd.getTime()/1000.0);

module.exports = {
	rate: rate,

	owner: owner,
	account1: account1,
	account2: account2,
	account3: account3,
	account4: account4,

	etherWallet: etherWallet,
	teamWallet: teamWallet,
	advisorWallet: advisorWallet,
	bountyWallet: bountyWallet,
	fundWallet: fundWallet,

	preSaleStartTime: preSaleStartTime,
	preSaleEndTime: preSaleEndTime,
	saleStartTime: saleStartTime,
	saleEndTime: saleEndTime
};