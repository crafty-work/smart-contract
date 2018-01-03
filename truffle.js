module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
	  development: {
	      host: "localhost", // Connect to geth on the specified
	      port: 9545,
	      network_id: "*",
	      gas: 4612388, // Gas limit used for deploys
	      gasPrice: 2000000000
	    },
	  ganache: {
	      host: "localhost", // Connect to geth on the specified
	      port: 7545,
	      network_id: 5777,
	      gas: 4612388, // Gas limit used for deploys
	      gasPrice: 2000000000
	    },
	  rinkeby: {
	      host: "localhost", // Connect to geth on the specified
	      port: 8545,
	      from: "0xAb4450dad80AE94d5DF1Ff1C6Fa632b44d4cf951", // default address to use for any transaction Truffle makes during migrations
	      network_id: 4,
	      gas: 4612388, // Gas limit used for deploys
	      gasPrice: 2000000000
	    }
    }
};
