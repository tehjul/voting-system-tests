const Voting = artifacts.require("Voting");
const { BN, expectRevert, expectEvent } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');

contract("Voting", accounts => {

  let _owner = accounts[0];
  let _user1 = accounts[1];
  let _user2 = accounts[2];

  let VotingInstance;

  describe('\n:::::::::: GETTERS ::::::::::\n', function () {

    //////////////
    // getVoter //
    //////////////

    describe('getVoter function', function () {

      beforeEach(async function () {
        VotingInstance = await Voting.new({ from: _owner });
        await VotingInstance.addVoter(_owner, { from: _owner });
      })

      // ::::: modifier ::::: //
      it("...should revert if not a voter", async () => {
        await expectRevert(VotingInstance.getVoter(_owner, { from: _user1 }), "You're not a voter");
      });

      // ::::: function ::::: //
      it("...should get a voter informations", async () => {
        let voter = await VotingInstance.getVoter(_owner, { from: _owner });
        expect(voter.isRegistered).to.be.true;
        expect(voter.hasVoted).to.be.false;
        expect(voter.votedProposalId).to.be.bignumber.equal(BN(0));
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
      });

      // ::::: modifier ::::: //
      it("...should revert if not a voter", async () => {
        await expectRevert(VotingInstance.getOneProposal(1, { from: _user1 }), "You're not a voter");
      });

      // ::::: function ::::: //
      it("...should get a proposal informations", async () => {
        let proposal = await VotingInstance.getOneProposal(1, { from: _owner });
        expect(proposal.description).to.be.equal("frites à la cantine");
        expect(proposal.voteCount).to.be.bignumber.equal(BN(0));
      });

    });
  });

  describe('\n:::::::::: REGISTRATION ::::::::::\n', function () {

    //////////////
    // addVoter //
    //////////////

    describe('addVoter function', function () {

      beforeEach(async function () {
        VotingInstance = await Voting.new({ from: _owner });
      });

      // ::::: modifier ::::: //
      it("...should revert if not the owner", async () => {
        await expectRevert(VotingInstance.addVoter(_user1, { from: _user1 }), "Ownable: caller is not the owner");
      });

      // ::::: require ::::: //
      it("...should revert if current status is not RegisteringVoters", async () => {
        await VotingInstance.startProposalsRegistering({ from: _owner });
        await expectRevert(VotingInstance.addVoter(_user2, { from: _owner }), "Voters registration is not open yet");
      });

      it("...should revert if adding twice the same voter", async () => {
        await VotingInstance.addVoter(_user1, { from: _owner });
        await expectRevert(VotingInstance.addVoter(_user1, { from: _owner }), "Already registered");
      });

      // ::::: function ::::: //
      it("...should add a new voter", async () => {
        await VotingInstance.addVoter(_owner, { from: _owner });
        let voter = await VotingInstance.getVoter(_owner, { from: _owner });
        expect(voter.isRegistered).to.be.true;
      });

      // ::::: event ::::: //
      it("...should emit an event", async () => {
        let transaction = await VotingInstance.addVoter(_user1, { from: _owner });
        expectEvent(transaction, "VoterRegistered", { voterAddress: _user1 });
      });

    });
  });


  describe('\n:::::::::: PROPOSAL ::::::::::\n', function () {

    /////////////////
    // addProposal //
    /////////////////

    describe('addProposal function', function () {

      beforeEach(async function () {
        VotingInstance = await Voting.new({ from: _owner });
        await VotingInstance.addVoter(_user1, { from: _owner });
        await VotingInstance.startProposalsRegistering({ from: _owner });
      });

      // ::::: modifier ::::: //
      it("...should revert if not a voter", async () => {
        await expectRevert(VotingInstance.addProposal("", { from: _user2 }), "You're not a voter");
      });

      // ::::: require ::::: //
      it("...should revert if current status is not ProposalsRegistrationStarted", async () => {
        await VotingInstance.endProposalsRegistering({ from: _owner });
        await expectRevert(VotingInstance.addProposal("", { from: _user1 }), "Proposals are not allowed yet");
      });

      it("...should revert if empty description", async () => {
        await expectRevert(VotingInstance.addProposal("", { from: _user1 }), "Vous ne pouvez pas ne rien proposer");
      });

      // ::::: function ::::: //
      it("...should add a proposal", async () => {
        await VotingInstance.addProposal("frites à la cantine", { from: _user1 });
        let proposal = await VotingInstance.getOneProposal(1, { from: _user1 });
        expect(proposal.description).to.be.equal("frites à la cantine");
        expect(proposal.voteCount).to.be.bignumber.equal(BN(0));
      });

      // ::::: event ::::: //
      it("...should emit an event", async () => {
        let transaction = await VotingInstance.addProposal("frites à la cantine", { from: _user1 });
        expectEvent(transaction, "ProposalRegistered", { proposalId: BN(1) });
      });

    });
  });

  describe('\n:::::::::: VOTE ::::::::::\n', function () {

    /////////////
    // setVote //
    /////////////

    describe('setVote function', function () {

      beforeEach(async function () {
        VotingInstance = await Voting.new({ from: _owner });
        await VotingInstance.addVoter(_user1, { from: _owner });
        await VotingInstance.startProposalsRegistering({ from: _owner });
        await VotingInstance.addProposal("frites à la cantine", { from: _user1 });
        await VotingInstance.endProposalsRegistering({ from: _owner });
        await VotingInstance.startVotingSession({ from: _owner });
      });

      // ::::: modifier ::::: //
      it("...should revert if not a voter", async () => {
        await expectRevert(VotingInstance.setVote(1, { from: _user2 }), "You're not a voter");
      });

      // ::::: require ::::: //
      it("...should revert if current status is not VotingSessionStarted", async () => {
        await VotingInstance.endVotingSession({ from: _owner });
        await expectRevert(VotingInstance.setVote(1, { from: _user1 }), "Voting session havent started yet");
      });

      it("...should revert if already voted", async () => {
        await VotingInstance.setVote(1, { from: _user1 });
        await expectRevert(VotingInstance.setVote(1, { from: _user1 }), "You have already voted");
      });

      it("...should revert if the proposal does not exist", async () => {
        await expectRevert(VotingInstance.setVote(20, { from: _user1 }), "Proposal not found");
      });

      // ::::: function ::::: //
      it("...should update voter informations", async () => {
        let voter = await VotingInstance.getVoter(_user1, { from: _user1 });
        expect(voter.votedProposalId).to.be.bignumber.equal(BN(0));
        expect(voter.hasVoted).to.be.false;
        await VotingInstance.setVote(1, { from: _user1 });
        voter = await VotingInstance.getVoter(_user1, { from: _user1 });
        expect(voter.votedProposalId).to.be.bignumber.equal(BN(1));
        expect(voter.hasVoted).to.be.true;
      });

      it("...should update proposalsArray voteCount", async () => {
        let proposal = await VotingInstance.getOneProposal(1, { from: _user1 });
        expect(proposal.voteCount).to.be.bignumber.equal(BN(0));
        await VotingInstance.setVote(1, { from: _user1 });
        proposal = await VotingInstance.getOneProposal(1, { from: _user1 });
        expect(proposal.voteCount).to.be.bignumber.equal(BN(1));
      });

      // ::::: event ::::: //
      it("...emit an event", async () => {
        let transaction = await VotingInstance.setVote(1, { from: _user1 });
        expectEvent(transaction, "Voted", { voter: _user1, proposalId: BN(1) });
      });

    });
  });

  describe('\n:::::::::: STATE ::::::::::\n', function () {

    const RegisteringVotersId = 0;
    const ProposalsRegistrationStartedId = 1;
    const ProposalsRegistrationEndedId = 2;
    const VotingSessionStartedId = 3;
    const VotingSessionEndedId = 4;
    const VotesTalliedId = 5;
  
    ///////////////////////////////
    // startProposalsRegistering //
    ///////////////////////////////

    describe('startProposalsRegistering function', function () {

      beforeEach(async function () {
        VotingInstance = await Voting.new({ from: _owner });
        await VotingInstance.addVoter(_owner, { from: _owner });
      });

      // ::::: modifier ::::: //
      it("...should revert if not the owner", async () => {
        await expectRevert(VotingInstance.startProposalsRegistering({ from: _user1 }), "Ownable: caller is not the owner");
      });

      // ::::: require ::::: //
      it("...should revert if RegisteringVoters is not set", async () => {
        await VotingInstance.startProposalsRegistering({ from: _owner });
        await expectRevert(VotingInstance.startProposalsRegistering({ from: _owner }), "Registering proposals cant be started now");
      });

      // ::::: function ::::: //
      it("...should add a genesis proposal", async () => {
        await VotingInstance.startProposalsRegistering({ from: _owner });
        let proposal = await VotingInstance.getOneProposal(0, { from: _owner });
        expect(proposal.description).to.be.equal("GENESIS");
        expect(proposal.voteCount).to.be.bignumber.equal(BN(0));
      });

      it("...should update workflowStatus variable", async () => {
        expect(await VotingInstance.workflowStatus.call()).to.be.bignumber.equal(BN(RegisteringVotersId));
        await VotingInstance.startProposalsRegistering({ from: _owner });
        expect(await VotingInstance.workflowStatus.call()).to.be.bignumber.equal(BN(ProposalsRegistrationStartedId));
      });

      // ::::: event ::::: //
      it("...should emit an event", async () => {
        let transaction = await VotingInstance.startProposalsRegistering({ from: _owner });
        expectEvent(transaction, "WorkflowStatusChange", { previousStatus: BN(RegisteringVotersId), newStatus: BN(ProposalsRegistrationStartedId) });
      });

    });

    /////////////////////////////
    // endProposalsRegistering //
    /////////////////////////////

    describe('endProposalsRegistering function', function () {

      beforeEach(async function () {
        VotingInstance = await Voting.new({ from: _owner });
        await VotingInstance.addVoter(_owner, { from: _owner });
        await VotingInstance.startProposalsRegistering({ from: _owner });
      });

      // ::::: modifier ::::: //
      it("...should revert if not the owner", async () => {
        await expectRevert(VotingInstance.endProposalsRegistering({ from: _user1 }), "Ownable: caller is not the owner");
      });

      // ::::: require ::::: //
      it("...should revert if ProposalsRegistrationStarted is not set", async () => {
        await VotingInstance.endProposalsRegistering({ from: _owner });
        await expectRevert(VotingInstance.endProposalsRegistering({ from: _owner }), "Registering proposals havent started yet");
      });

      // ::::: function ::::: //
      it("...should update workflowStatus variable", async () => {
        expect(await VotingInstance.workflowStatus.call()).to.be.bignumber.equal(BN(ProposalsRegistrationStartedId));
        await VotingInstance.endProposalsRegistering({ from: _owner });
        expect(await VotingInstance.workflowStatus.call()).to.be.bignumber.equal(BN(ProposalsRegistrationEndedId));
      });

      // ::::: event ::::: //
      it("...should emit an event", async () => {
        let transaction = await VotingInstance.endProposalsRegistering({ from: _owner });
        expectEvent(transaction, "WorkflowStatusChange", { previousStatus: BN(ProposalsRegistrationStartedId), newStatus: BN(ProposalsRegistrationEndedId) });
      });

    });

    ////////////////////////
    // startVotingSession //
    ////////////////////////

    describe('startVotingSession function', function () {

      beforeEach(async function () {
        VotingInstance = await Voting.new({ from: _owner });
        await VotingInstance.addVoter(_owner, { from: _owner });
        await VotingInstance.startProposalsRegistering({ from: _owner });
        await VotingInstance.endProposalsRegistering({ from: _owner });
      });

      // ::::: modifier ::::: //
      it("...should revert if not the owner", async () => {
        await expectRevert(VotingInstance.startVotingSession({ from: _user1 }), "Ownable: caller is not the owner");
      });

      // ::::: require ::::: //
      it("...should revert if ProposalsRegistrationEnded is not set", async () => {
        await VotingInstance.startVotingSession({ from: _owner });
        await expectRevert(VotingInstance.startVotingSession({ from: _owner }), "Registering proposals phase is not finished");
      });

      // ::::: function ::::: //
      it("...should update workflowStatus variable", async () => {
        expect(await VotingInstance.workflowStatus.call()).to.be.bignumber.equal(BN(ProposalsRegistrationEndedId));
        await VotingInstance.startVotingSession({ from: _owner });
        expect(await VotingInstance.workflowStatus.call()).to.be.bignumber.equal(BN(VotingSessionStartedId));
      });

      // ::::: event ::::: //
      it("...should emit an event", async () => {
        let transaction = await VotingInstance.startVotingSession({ from: _owner });
        expectEvent(transaction, "WorkflowStatusChange", { previousStatus: BN(ProposalsRegistrationEndedId), newStatus: BN(VotingSessionStartedId) });
      });

    });

    ////////////////////////
    // endVotingSession //
    ////////////////////////

    describe('endVotingSession function', function () {

      beforeEach(async function () {
        VotingInstance = await Voting.new({ from: _owner });
        await VotingInstance.addVoter(_owner, { from: _owner });
        await VotingInstance.startProposalsRegistering({ from: _owner });
        await VotingInstance.endProposalsRegistering({ from: _owner });
        await VotingInstance.startVotingSession({ from: _owner });
      });

      // ::::: modifier ::::: //
      it("...should revert if not the owner", async () => {
        await expectRevert(VotingInstance.endVotingSession({ from: _user1 }), "Ownable: caller is not the owner");
      });

      // ::::: require ::::: //
      it("...should revert if VotingSessionStarted is not set", async () => {
        await VotingInstance.endVotingSession({ from: _owner });
        await expectRevert(VotingInstance.endVotingSession({ from: _owner }), "Voting session havent started yet");
      });

      // ::::: function ::::: //
      it("...should update workflowStatus variable", async () => {
        expect(await VotingInstance.workflowStatus.call()).to.be.bignumber.equal(BN(VotingSessionStartedId));
        await VotingInstance.endVotingSession({ from: _owner });
        expect(await VotingInstance.workflowStatus.call()).to.be.bignumber.equal(BN(VotingSessionEndedId));
      });

      // ::::: event ::::: //
      it("...should emit an event", async () => {
        let transaction = await VotingInstance.endVotingSession({ from: _owner });
        expectEvent(transaction, "WorkflowStatusChange", { previousStatus: BN(VotingSessionStartedId), newStatus: BN(VotingSessionEndedId) });
      });

    });

    ////////////////
    // tallyVotes //
    ////////////////

    describe('tallyVotes function', function () {

      beforeEach(async function () {
        VotingInstance = await Voting.new({ from: _owner });
        await VotingInstance.addVoter(_owner, { from: _owner });
        await VotingInstance.startProposalsRegistering({ from: _owner });
        await VotingInstance.addProposal("frites à la cantine", { from: _owner });
        await VotingInstance.endProposalsRegistering({ from: _owner });
        await VotingInstance.startVotingSession({ from: _owner });
        await VotingInstance.setVote(1, { from: _owner });
        await VotingInstance.endVotingSession({ from: _owner });
      });

      // ::::: modifier ::::: //
      it("...should revert if not the owner", async () => {
        await expectRevert(VotingInstance.tallyVotes({ from: _user1 }), "Ownable: caller is not the owner");
      });

      // ::::: require ::::: //
      it("...should revert if VotingSessionEnded is not set", async () => {
        await VotingInstance.tallyVotes({ from: _owner });
        await expectRevert(VotingInstance.tallyVotes({ from: _owner }), "Current status is not voting session ended");
      });

      // ::::: function ::::: //
      it("...should update winningProposalID variable", async () => {
        expect(await VotingInstance.winningProposalID.call()).to.be.bignumber.equal(BN(0));
        await VotingInstance.tallyVotes({ from: _owner });
        expect(await VotingInstance.winningProposalID.call()).to.be.bignumber.equal(BN(1));
      });

      it("...should update workflowStatus variable", async () => {
        expect(await VotingInstance.workflowStatus.call()).to.be.bignumber.equal(BN(VotingSessionEndedId));
        await VotingInstance.tallyVotes({ from: _owner });
        expect(await VotingInstance.workflowStatus.call()).to.be.bignumber.equal(BN(VotesTalliedId));
      });

      // ::::: event ::::: //
      it("...should emit an event", async () => {
        let transaction = await VotingInstance.tallyVotes({ from: _owner });
        expectEvent(transaction, "WorkflowStatusChange", { previousStatus: BN(VotingSessionEndedId), newStatus: BN(VotesTalliedId) });
      });

    });
  });

});