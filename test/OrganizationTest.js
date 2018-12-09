let Organization = artifacts.require("./Organization.sol");

contract("Organization", (acc) => {
    let org;

    it("Transfers ownership of contract only by owner", () => {
        return Organization.deployed().then((instance) => {
            org = instance;
            return instance;
        }).then((i) => {
            return org.transferOwnership(acc[1], {from: acc[1]});
        }).then(assert.fail).catch((error) => {   
            assert(error.message.indexOf("revert") >= 0, "Error message does not contain revert");
            return org.transferOwnership(acc[1], {from: acc[0]});
        }).then((rec) => {
            org.transferOwnership(acc[0], {from: acc[1]});
        });
    });

    it("Adds members only from the owner", () => {
        return Organization.deployed().then((instance) => {
            org = instance;
            return org.addMember(acc[1], {from: acc[1]});
        }).then(assert.fail).catch((error) => {
            assert(error.message.indexOf("revert") >= 0, "Error message does not contain revert");
            org.addMember(acc[1], {from: acc[0]});
        })
    });

    it("Only has 5 board members", () => {
        return Organization.deployed().then((instance) => {
            org = instance;
            org.addBoardMember(acc[2], {from: acc[0]});
            org.addBoardMember(acc[3], {from: acc[0]});
            org.addBoardMember(acc[4], {from: acc[0]});
            org.addBoardMember(acc[5], {from: acc[0]});
            org.addBoardMember(acc[6], {from: acc[0]});
            return org.addBoardMember(acc[7], {from: acc[0]});
        }).then(assert.fail).catch((error) => {
            assert(error.message.indexOf("revert") >= 0, "Error message does not contain revert");
        });
    });

    it("Only owner can promote/demote board members", () => {
        return Organization.deployed().then((instance) => {
            org = instance;
            return org.removeBoardMember(acc[2], {from: acc[1]});
        }).then(assert.fail).catch((error) => {
            assert(error.message.indexOf("revert") >= 0, "Error message does not contain revert");
            return org.removeBoardMember(acc[2], {from: acc[0]});            
        }).then((rec) => {
            org.addBoardMember(acc[2], {from: acc[0]});
        });
    });

    it("Only board members can create polls", () => {
        return Organization.deployed().then((instance) => {
            org = instance;
            return org.addPoll("Raise salary", {from: acc[7]});
        }).then(assert.fail).catch((error) => {
            assert(error.message.indexOf("revert") >= 0, "Error message does not contain revert");
            return org.addPoll("Raise salary", {from: acc[6]});
        }).then((rec) => {
            return org.addOptionToPoll(0, "20%", {from: acc[6]});
        }).then((rec) => {
            return org.addOptionToPoll(0, "25%", {from: acc[6]});
        }).then((rec) => {
            return org.polls(0);
        }).then((poll) => {
            assert.equal(poll[1], "Raise salary", "Poll was not created");
            return org.pollOptions(0, 0);
        }).then((opt) => {
            assert.equal(opt[1], "20%", "Sets right title to option");
            assert.equal(opt[2], 0, "Sets right votes to option");
            return org.pollOptions(0, 1);
        }).then((opt) => {
            assert.equal(opt[1], "25%", "Sets right title to option");
            assert.equal(opt[2], 0, "Sets right votes to option");
        });
    });

    it("Members can vote only once", () => {
        return Organization.deployed().then((instance) => {
            org = instance;
            org.vote(0, 1, {from: acc[2]});
            return org.pollOptions(0, 1);
        }).then((option) => {
            assert.equal(option[2], 1, "Vote was not recorded");
            return org.vote(0, 1, {from: acc[2]});
        }).then(assert.fail).catch((error) => {
            assert(error.message.indexOf("revert") >= 0, "Error message does not contain revert");
        });
    });

    it("Poll creators cannot vote for their poll", () => {
        return Organization.deployed().then((instance) => {
            org = instance;
            return org.vote(0, 0);
        }).then(assert.fail).catch((error) => {
            assert(error.message.indexOf("revert") >= 0, "Error message does not contain revert");
        });
    });
});
