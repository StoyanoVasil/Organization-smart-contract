const mnemonic = "rate swamp prevent mistake document segment engine lock gym bright sea tobacco";
const endpoint = "https://ropsten.infura.io/v3/62fdee7acc154d19b828c20da83deef9";

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    ropsten: { 
      provider: function() {
        return new HDWalletProvider(mnemonic, endpoint);
      },
      network_id: 3,
      gas: 400000
    }
  }
};
