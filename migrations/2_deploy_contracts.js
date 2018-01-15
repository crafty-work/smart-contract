var CraftyToken = artifacts.require("./CraftyToken.sol");
var CraftyCrowdsale = artifacts.require("./CraftyCrowdsale.sol");


module.exports = function(deployer, network) {
    // Variables should be set on each environment
    var preSaleStart, preSaleEnd, saleStart, saleEnd;
    var etherWallet, teamWallet, advisorWallet, bountyWallet, fundWallet;
    // Common variables
    var preSaleStartTime, preSaleEndTime, saleStartTime, saleEndTime;

    if (network == "live") {
        // Production network
    } else if (network == "rinkeby") {
        // Rinkeby network
        preSaleStart = new Date("January 5, 2018 03:00:00 GMT");
        preSaleEnd = new Date("January 7, 2018 03:00:00 GMT");
        saleStart = new Date("January 9, 2018 03:00:00 GMT");
        saleEnd = new Date("January 11, 2018 03:00:00 GMT");

        etherWallet = "0x3fCF658B6D4B022Fde0Dc2428B02cE83929a96Ef";
        teamWallet = "0xc172538611d3801F833D0D24C9874d0a6A2d0381";
        advisorWallet = "0x627306090abaB3A6e1400e9345bC60c78a8BEf57";
        bountyWallet = "0x1f1481E24FCCf09E4710a081988D86019436b6fB";
        fundWallet = "0x33eEE0d32810171106656B96b490bA935792219e";

    } else {
        // Development network
        preSaleStart = new Date("March 2, 2018 14:13:20 GMT"); //1520000000
        preSaleEnd = new Date("March 14, 2018 04:00:00 GMT"); //1521000000
        saleStart = new Date("March 25, 2018 17:46:40 GMT"); //1522000000
        saleEnd = new Date("April 6, 2018 07:33:20 GMT"); //1523000000

        etherWallet = "0xf17f52151ebef6c7334fad080c5704d77216b732";
        teamWallet = "0xc5fdf4076b8f3a5357c5e395ab970b5b54098fef";
        advisorWallet = "0x821aea9a577a9b44299b9c15c88cf3087f3b5544";
        bountyWallet = "0x0d1d4e623d10f9fba5db95830f7d3839406c6af2";
        fundWallet = "0x2932b7a2355d6fecc4b5c0b6bd44cc31df247a2e";
    }

    rate = 10714285714286;
    preSaleStartTime = Math.round(preSaleStart.getTime()/1000.0);
    preSaleEndTime = Math.round(preSaleEnd.getTime()/1000.0);
    saleStartTime = Math.round(saleStart.getTime()/1000.0);
    saleEndTime = Math.round(saleEnd.getTime()/1000.0);


    var token;
    var crowdsale;

    deployer.deploy(CraftyToken).then(function() {
        return deployer.deploy(CraftyCrowdsale, CraftyToken.address, preSaleStartTime, preSaleEndTime, saleStartTime, saleEndTime, rate);
    }).then(function(tx) {
        return CraftyToken.deployed();
    }).then(function(instance) {
        token = instance;
        token.setMintAddress(CraftyCrowdsale.address);
        return CraftyCrowdsale.deployed();
    }).then(function(instance) {
        crowdsale = instance;
        crowdsale.setWallets(etherWallet, teamWallet, advisorWallet, bountyWallet, fundWallet);
    });
};