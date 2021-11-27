require('dotenv').config()

const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {
  plugins: [
    'truffle-plugin-verify'
  ],
  networks: {
    development: {
     host: "127.0.0.1",
     port: 8545,  
     network_id: "*", 
    },
    rinkeby: {
      provider: function() { 
       return new HDWalletProvider(process.env.RINKEBY_PRIVATE_KEY, process.env.RINKEBY_INFURA_URL);
      },
      network_id: 4,
      gas: 4500000,
      gasPrice: 10000000000,
    }
  },
  compilers: {
    solc: {
      version: "0.8.9",
       optimizer: {
         enabled: true,
         runs: 200
       }
    }
  },
  contracts_directory: './src/contracts/',
  contracts_build_directory: "./src/abis",
  api_keys: {
    etherscan: process.env.ETHERSCAN_API_KEY
  }
};
