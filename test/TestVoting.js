const Voting = artifacts.require("Voting");
const { BN, expectRevert, expectEvent } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const { assert } = require('console');

contract("Voting", accounts => {

  let _owner = accounts[0];
  let _user1 = accounts[1];
  let _user2 = accounts[2];
  let _user3 = accounts[3];

  let VotingInstance;

  it("...should deploy the contract", async () => {
    VotingInstance = await Voting.new({ from: _owner });
  });

  ///////////////////////////////
  // registering voters status //
  ///////////////////////////////

  it("...should add a new voters and emit events", async () => {
    let transaction = await VotingInstance.addVoter(_owner, { from: _owner });
    expectEvent(transaction, "VoterRegistered", { voterAddress: _owner });
    let transaction1 = await VotingInstance.addVoter(_user1, { from: _owner });
    expectEvent(transaction1, "VoterRegistered", { voterAddress: _user1 });
    let transaction2 = await VotingInstance.addVoter(_user2, { from: _owner });
    expectEvent(transaction2, "VoterRegistered", { voterAddress: _user2 });
  });

  it("...should not add a new voter if not the owner", async () => {
    await expectRevert(VotingInstance.addVoter(_user1, { from: _user1 }), "Ownable: caller is not the owner");
  });

  it("...should not be possible to register the same voter", async () => {
    await expectRevert(VotingInstance.addVoter(_owner, { from: _owner }), "Already registered");
  });

  it("...should get a voter informations", async () => {
    let voter = await VotingInstance.getVoter(_owner, { from: _owner });
    expect(voter.isRegistered).to.be.true;
    expect(voter.hasVoted).to.be.false;
    expect(voter.votedProposalId).to.be.bignumber.equal(BN(0));
  });

  it("...should not be possible to get a voter informations if not a voter", async () => {
    await expectRevert(VotingInstance.getVoter(_owner, { from: _user3 }), "You're not a voter");
  });

  ///////////////////////////////////////////
  // proposals registration started status //
  ///////////////////////////////////////////

  it("...should not be possible to start proposals registering if not the owner", async () => {
    await expectRevert(VotingInstance.startProposalsRegistering({ from: _user1 }), "Ownable: caller is not the owner");
  });

  it("...should start proposals registering and emit an event", async () => {
    let transaction = await VotingInstance.startProposalsRegistering({ from: _owner });
    expectEvent(transaction, "WorkflowStatusChange", { previousStatus: BN(0), newStatus: BN(1) });
  });

  it("...should not be possible to start proposals registering if already set", async () => {
    await expectRevert(VotingInstance.startProposalsRegistering({ from: _owner }), "Registering proposals cant be started now");
  });

  it("...should not be possible to register a new voter when proposals registration is started", async () => {
    await expectRevert(VotingInstance.addVoter(_user3, { from: _owner }), "Voters registration is not open yet");
  });

  /////////////////////////////////////////
  // proposals registration ended status //
  /////////////////////////////////////////

  ///////////////////////////////////
  // voting session started status //
  ///////////////////////////////////

  /////////////////////////////////
  // voting session ended status //
  /////////////////////////////////

  //////////////////////////
  // votes tallied status //
  //////////////////////////

});