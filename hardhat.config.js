require("@nomicfoundation/hardhat-toolbox");


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  mocha: {
    timeout: 300000
  },
  networks: {
    hardhat: {
      accounts: {
        count: 100,
        accountsBalance: '100000000000000000000000',
      },
    },
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    ganache: {
      url: "http://ganache:8545",
    },
  }
};
