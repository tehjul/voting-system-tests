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

  // TODO : add tests for each function of changing status on every steps
  // TODO : same for add voter, addProposal and setVote
  // TODO : add .call() after each getter

  //////////////
  // getVoter //
  //////////////

  describe('getVoter function', function () {

    beforeEach(async function () {
      VotingInstance = await Voting.new({ from: _owner });
      await VotingInstance.addVoter(_owner, { from: _owner });
    })

    it("...should get a voter informations", async () => {
      let voter = await VotingInstance.getVoter(_owner, { from: _owner });
      expect(voter.isRegistered).to.be.true;
      expect(voter.hasVoted).to.be.false;
      expect(voter.votedProposalId).to.be.bignumber.equal(BN(0));
    });

    it("...should revert if not a voter", async () => {
      await expectRevert(VotingInstance.getVoter(_owner, { from: _user3 }), "You're not a voter");
    });

  });

  ////////////////////
  // getOneProposal //
  ////////////////////

  describe('getOneProposal function', function () {

    beforeEach(async function () {
      VotingInstance = await Voting.new({ from: _owner });
      await VotingInstance.addVoter(_owner, { from: _owner });
      await VotingInstance.startProposalsRegistering({ from: _owner });
      await VotingInstance.addProposal("frites à la cantine", { from: _owner });
    })

    it("...should get a proposal informations", async () => {
      let proposal = await VotingInstance.getOneProposal(1, { from: _owner });
      expect(proposal.description).to.be.equal("frites à la cantine");
      expect(proposal.voteCount).to.be.bignumber.equal(BN(0));
    });

    it("...should revert if not a voter", async () => {
      await expectRevert(VotingInstance.getOneProposal(1, { from: _user3 }), "You're not a voter");
    });

  });

  //////////////
  // addVoter //
  //////////////

  describe('addVoter function', function () {

    beforeEach(async function () {
      VotingInstance = await Voting.new({ from: _owner });
      await VotingInstance.addVoter(_owner, { from: _owner });
    })

    it("...should add a new voter", async () => {
      let voter = await VotingInstance.getVoter(_user1, { from: _owner });
      expect(voter.isRegistered).to.be.false;
      await VotingInstance.addVoter(_user1, { from: _owner });
      voter = await VotingInstance.getVoter(_user1, { from: _owner });
      expect(voter.isRegistered).to.be.true;
    });

    it("...should emit an event", async () => {
      let transaction = await VotingInstance.addVoter(_user1, { from: _owner });
      expectEvent(transaction, "VoterRegistered", { voterAddress: _user1 });
    });

    it("...should revert if not the owner", async () => {
      await expectRevert(VotingInstance.addVoter(_user1, { from: _user1 }), "Ownable: caller is not the owner");
    });

    it("...should revert if adding twice the same voter", async () => {
      await VotingInstance.addVoter(_user1, { from: _owner });
      await expectRevert(VotingInstance.addVoter(_user1, { from: _owner }), "Already registered");
    });

    it("...should revert if current status is not RegisteringVoters", async () => {
      await VotingInstance.startProposalsRegistering({ from: _owner });
      await expectRevert(VotingInstance.addVoter(_user3, { from: _owner }), "Voters registration is not open yet");
    });

  });

/*   it("...should not be possible to start proposals registering if not the owner", async () => {
    await expectRevert(VotingInstance.startProposalsRegistering({ from: _user1 }), "Ownable: caller is not the owner");
  });

  it("...should start proposals registering and emit an event", async () => {
    let transaction = await VotingInstance.startProposalsRegistering({ from: _owner });
    expectEvent(transaction, "WorkflowStatusChange", { previousStatus: BN(0), newStatus: BN(1) });
  });

  it("...should not be possible to start proposals registering if already set", async () => {
    await expectRevert(VotingInstance.startProposalsRegistering({ from: _owner }), "Registering proposals cant be started now");
  });

  it("...should add proposals and emit events", async () => {
    let currentProposalId = 1;
    // proposal #1
    let transaction = await VotingInstance.addProposal("frites à la cantine", { from: _owner });
    expectEvent(transaction, "ProposalRegistered", { proposalId: BN(currentProposalId++) });
    // proposal #2
    let transaction1 = await VotingInstance.addProposal("bière à la cantine", { from: _user1 });
    expectEvent(transaction1, "ProposalRegistered", { proposalId: BN(currentProposalId++) });
    // proposal #3
    let transaction2 = await VotingInstance.addProposal("homard à la cantine", { from: _user2 });
    expectEvent(transaction2, "ProposalRegistered", { proposalId: BN(currentProposalId++) });
  });

  it("...should not add proposal if empty description", async () => {
    await expectRevert(VotingInstance.addProposal("", { from: _owner }), "Vous ne pouvez pas ne rien proposer");
  });

  it("...should not add proposal if not a voter", async () => {
    await expectRevert(VotingInstance.addProposal("", { from: _user3 }), "You're not a voter");
  });

  /////////////////////////////////////////
  // proposals registration ended status //
  /////////////////////////////////////////

  it("...should not be possible to end proposals registering if not the owner", async () => {
    await expectRevert(VotingInstance.endProposalsRegistering({ from: _user1 }), "Ownable: caller is not the owner");
  });

  it("...should end proposals registering and emit an event", async () => {
    let transaction = await VotingInstance.endProposalsRegistering({ from: _owner });
    expectEvent(transaction, "WorkflowStatusChange", { previousStatus: BN(1), newStatus: BN(2) });
  });

  it("...should not be possible to end proposals registering if already set", async () => {
    await expectRevert(VotingInstance.endProposalsRegistering({ from: _owner }), "Registering proposals havent started yet");
  });

  ///////////////////////////////////
  // voting session started status //
  ///////////////////////////////////

  it("...should not be possible to start voting session if not the owner", async () => {
    await expectRevert(VotingInstance.startVotingSession({ from: _user1 }), "Ownable: caller is not the owner");
  });

  it("...should start voting session and emit an event", async () => {
    let transaction = await VotingInstance.startVotingSession({ from: _owner });
    expectEvent(transaction, "WorkflowStatusChange", { previousStatus: BN(2), newStatus: BN(3) });
  });

  it("...should not be possible to start voting session if already set", async () => {
    await expectRevert(VotingInstance.startVotingSession({ from: _owner }), "Registering proposals phase is not finished");
  });

  it("...should not be possible set vote for a non existing proposal", async () => {
    await expectRevert(VotingInstance.setVote(20, { from: _owner }), "Proposal not found");
  });

  it("...should set votes and emit events", async () => {
    let transaction = await VotingInstance.setVote(2, { from: _owner });
    expectEvent(transaction, "Voted", { voter: _owner, proposalId: BN(2) });
    let transaction1 = await VotingInstance.setVote(2, { from: _user1 });
    expectEvent(transaction1, "Voted", { voter: _user1, proposalId: BN(2) });
    let transaction2 = await VotingInstance.setVote(1, { from: _user2 });
    expectEvent(transaction2, "Voted", { voter: _user2, proposalId: BN(1) });
  });

  it("...should have updated proposal informations", async () => {
    let proposal = await VotingInstance.getOneProposal(2, { from: _owner });
    expect(proposal.voteCount).to.be.bignumber.equal(BN(2));
  });

  it("...should not be possible to set vote if already voted", async () => {
    await expectRevert(VotingInstance.setVote(2, { from: _owner }), "You have already voted");
  });

  it("...should not be possible to set vote if not a voter", async () => {
    await expectRevert(VotingInstance.setVote(1, { from: _user3 }), "You're not a voter");
  });

  it("...should get a voter voted proposal id", async () => {
    let voter = await VotingInstance.getVoter(_owner, { from: _user2 });
    expect(voter.votedProposalId).to.be.bignumber.equal(BN(2));
  }); */

});