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
    let org;
    let polls = $("#polls");
    polls.val("");

    web3.eth.getCoinbase((err, acc) => {
      if(err == null) {
        App.acc = acc;
      }
    });

    App.contracts.Organization.deployed().then((i) => {
      org = i;
      return i.pollsCount();
    }).then((count) => {
      let content = "";
      for(let i = 0; i < count; i++) {
        org.polls(i).then((poll) => {
          content += "<div class='card col-lg-4'><div class='card-body'><h3 class='text-center'>" + poll[1] + "</h3><div class='btn-group' role='group' aria-label='Button group with nested dropdown'><form class='form-inline' role='group'><div class='form-group'><select class='form-control' id='option" + i + "'>";
          for(let z = 0; z < poll[2]; z++) {
            org.pollOptions(i, z).then((opt) => {
              // not working for some reason
              content += "<option value='" + opt[0] + "'>" + opt[1] + "</option>";
            });
          }
          content += "</select></div><button type='button' onClick='App.vote(" + i + ")' class='btn btn-success'>Vote</button></form></div></div></div>";
          polls.append(content)
        })
      }
    })
  },

  addMember: function() {
    console.log(1);
    let org;
    let address = $("#inputAddress").val();
    console.log(address);

    App.contracts.Organization.deployed().then((i) => {
      org = i;
      return org.addMember(address, {from: App.acc});
    }).then((result) => {
      App.init();
    }).catch((err) => {
      console.log(err);
    });
  },

  addBoardMember: function() {
    let org;
    let address = $("#inputAddress").val();

    App.contracts.Organization.deployed().then((i) => {
      org = i;
      return org.addBoardMember(address, {from: App.acc});
    }).then((result) => {
      App.init();
    }).catch((err) => {
      console.log(err);
    });
  },

  removeBoardMember: function() {
    let org;
    let address = $("#inputAddress").val();

    App.contracts.Organization.deployed().then((i) => {
      org = i;
      return org.removeBoardMember(address, {from: App.acc});
    }).then((result) => {
      App.init();
    }).catch((err) => {
      console.log(err);
    });
  },

  createPoll: function() {
    console.log(t);
    let org;
    let pollTitle = $("#pollTitle").val();
    let options = $("#options").val().split(",");

    App.contracts.Organization.deployed().then((i) => {
      org = i;
      org.addPoll(pollTitle, {from: App.acc});
      return org.pollsCount();
    }).then((count) => {
      for(let i = 0; i < options.length; i++) {
        org.addOptionToPoll(count-1, options[i], {from: App.acc});
      }
    }).catch((err) => {
      console.log(err);
    });
  },

  vote: function(i) {
    let temp = "option" + i;
    let option = $(temp);

    App.contracts.Organization.deployed().then((i) => {
      org = i;
      return org.vote(i, option, {from: App.acc});
    }).then((result) => {
      App.init();
    }).catch((error) => {
      console.log(error);
    });
  } 
};

$(function() {
  $(window).ready(function() {
    App.init();
  });
});
