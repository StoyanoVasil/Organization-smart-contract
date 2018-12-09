App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    if(typeof web3 !== undefined) {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      App.web3Provider = new Web3.providers.HttpProvider("http://localhost:7545");
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("Organization.json", (organization) => {
      App.contracts.Organization = TruffleContract(organization);
      App.contracts.Organization.setProvider(App.web3Provider);
      return App.render();
    });
  },

  render: function() {
    
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
