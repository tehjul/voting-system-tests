// require('dotenv').config();
// const { COINMARKETCAP_API } = process.env;

module.exports = {

  networks: {
    development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 8545,            // Standard Ethereum port (default: none)
      network_id: "*",       // Any network (default: none)
    },
  },

  mocha: {
    reporter: 'eth-gas-reporter',
    // reporterOptions: {
    //   currency: 'USD',
    //   coinmarketcap: COINMARKETCAP_API,
    //   token: 'ETH',
    //   gasPriceApi: 'https://api.etherscan.io/api?module=proxy&action=eth_gasPrice'
    // }
  },

  compilers: {
    solc: {
      version: "0.8.13", // Fetch exact version from solc-bin (default: truffle's version)
      settings: {          // See the solidity docs for advice about optimization and evmVersion
        optimizer: {
          enabled: false,
          runs: 200
        },
      }
    }
  }
};
