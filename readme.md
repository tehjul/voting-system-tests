![Solidity](https://img.shields.io/badge/Solidity-%23363636.svg?style=for-the-badge&logo=solidity&logoColor=white)

![Node.js](https://img.shields.io/badge/Node.js-%339933.svg?style=for-the-badge&logo=nodedotjs&logoColor=black)

![https://github.com/tehjul](https://img.shields.io/badge/Compiler-0.8.13-blue?style=plastic)

Smart contract developed by [Cyril CASTAGNET](https://github.com/lecascyril)

# Getting started
## Dependencies

- NodeJS

## Installation

```js
// Truffle
npm install -g truffle
```
```js
// Install packages
npm install
```

## Launch tests

```js
// Launch Ganache (in a separate terminal)
ganache
```

```js
// Compile and deploy the smart contract
truffle migrate
```

```js
// Run tests
truffle test
```

# Voting system unit tests project
Pour réaliser les tests, j'ai choisi classer les tests à l'aide de **describe** dans des sections qui reprennent la même structure que le smart contract :

### PUBLIC VARIABLES

- winningProposalID
- workflowStatus

### GETTERS

- getVoter
- getOneProposal

### REGISTRATION

- addVoter

### PROPOSAL

- addProposal

### VOTE

- setVote

### STATE

- startProposalsRegistering
- endProposalsRegistering
- startVotingSession
- endVotingSession
- tallyVotes
***
\
Pour chaque méthode, je teste le ou les **modifier**, puis les **require** un par un, ensuite le coeur de la **fonction** qui peut effectuer une ou plusieurs actions, et pour finir les éventuels **event**.
\
Des commentaires ont été ajoutés avant chaque bloc de test afin de se repérer plus facilement.

Voici la sortie console des tests effectués :

```java
  Contract: Voting
    
:::::::::: PUBLIC VARIABLES ::::::::::

      winningProposalID
        ✓ ...should get the variable value
      workflowStatus
        ✓ ...should get the variable value
    
:::::::::: GETTERS ::::::::::

      getVoter function
        ✓ ...should revert if not a voter
        ✓ ...should get a voter informations
      getOneProposal function
        ✓ ...should revert if not a voter
        ✓ ...should get a proposal informations
    
:::::::::: REGISTRATION ::::::::::

      addVoter function
        ✓ ...should revert if not the owner
        ✓ ...should revert if current status is not RegisteringVoters (94840 gas)
        ✓ ...should revert if adding twice the same voter (50220 gas)
        ✓ ...should add a new voter (50220 gas)
        ✓ ...should emit an event (50220 gas)
    
:::::::::: PROPOSAL ::::::::::

      addProposal function
        ✓ ...should revert if not a voter
        ✓ ...should revert if current status is not ProposalsRegistrationStarted (30599 gas)
        ✓ ...should revert if empty description
        ✓ ...should add a proposal (59208 gas)
        ✓ ...should emit an event (59208 gas)
    
:::::::::: VOTE ::::::::::

      setVote function
        ✓ ...should revert if not a voter
        ✓ ...should revert if current status is not VotingSessionStarted (30533 gas)
        ✓ ...should revert if already voted (78013 gas)
        ✓ ...should revert if the proposal does not exist
        ✓ ...should update voter informations (78013 gas)
        ✓ ...should update proposalsArray voteCount (78013 gas)
        ✓ ...emit an event (78013 gas)
    
:::::::::: STATE ::::::::::

      startProposalsRegistering function
        ✓ ...should revert if not the owner
        ✓ ...should revert if RegisteringVoters is not set (94840 gas)
        ✓ ...should add a genesis proposal (94840 gas)
        ✓ ...should update workflowStatus variable (94840 gas)
        ✓ ...should emit an event (94840 gas)
      endProposalsRegistering function
        ✓ ...should revert if not the owner
        ✓ ...should revert if ProposalsRegistrationStarted is not set (30599 gas)
        ✓ ...should update workflowStatus variable (30599 gas)
        ✓ ...should emit an event (30599 gas)
      startVotingSession function
        ✓ ...should revert if not the owner
        ✓ ...should revert if ProposalsRegistrationEnded is not set (30554 gas)
        ✓ ...should update workflowStatus variable (30554 gas)
        ✓ ...should emit an event (30554 gas)
      endVotingSession function
        ✓ ...should revert if not the owner
        ✓ ...should revert if VotingSessionStarted is not set (30533 gas)
        ✓ ...should update workflowStatus variable (30533 gas)
        ✓ ...should emit an event (30533 gas)
      tallyVotes function
        ✓ ...should revert if not the owner
        ✓ ...should revert if VotingSessionEnded is not set (60661 gas)
        ✓ ...should update winningProposalID variable (60661 gas)
        ✓ ...should update workflowStatus variable (60661 gas)
        ✓ ...should emit an event (60661 gas)
```

***
\
Enfin j'ai ajouté le package **eth-gas-reporter** afin d'avoir un apercu du coût en gas du déploiement et de chaque fonctions. J'ai ajouté quelques options afin de visualiser le coût en dollar, mais je les ai volontairement commentées car cela nécéssite une clé API.
```java
·------------------------------------------|----------------------------|-------------|----------------------------·
|   Solc version: 0.8.13+commit.abaa5c0e   ·  Optimizer enabled: false  ·  Runs: 200  ·  Block limit: 6718946 gas  │
···········································|····························|·············|·····························
|  Methods                                 ·               19 gwei/gas                ·      1552.09 usd/eth       │
·············|·····························|··············|·············|·············|··············|··············
|  Contract  ·  Method                     ·  Min         ·  Max        ·  Avg        ·  # calls     ·  usd (avg)  │
·············|·····························|··············|·············|·············|··············|··············
|  Voting    ·  addProposal                ·           -  ·          -  ·      59208  ·          20  ·       1.75  │
·············|·····························|··············|·············|·············|··············|··············
|  Voting    ·  addVoter                   ·           -  ·          -  ·      50220  ·          47  ·       1.48  │
·············|·····························|··············|·············|·············|··············|··············
|  Voting    ·  endProposalsRegistering    ·           -  ·          -  ·      30599  ·          29  ·       0.90  │
·············|·····························|··············|·············|·············|··············|··············
|  Voting    ·  endVotingSession           ·           -  ·          -  ·      30533  ·          14  ·       0.90  │
·············|·····························|··············|·············|·············|··············|··············
|  Voting    ·  setVote                    ·           -  ·          -  ·      78013  ·          13  ·       2.30  │
·············|·····························|··············|·············|·············|··············|··············
|  Voting    ·  startProposalsRegistering  ·           -  ·          -  ·      94840  ·          44  ·       2.80  │
·············|·····························|··············|·············|·············|··············|··············
|  Voting    ·  startVotingSession         ·           -  ·          -  ·      30554  ·          25  ·       0.90  │
·············|·····························|··············|·············|·············|··············|··············
|  Voting    ·  tallyVotes                 ·           -  ·          -  ·      60661  ·           7  ·       1.79  │
·············|·····························|··············|·············|·············|··············|··············
|  Deployments                             ·                                          ·  % of limit  ·             │
···········································|··············|·············|·············|··············|··············
|  Voting                                  ·           -  ·          -  ·    1970027  ·      29.3 %  ·      58.10  │
·------------------------------------------|--------------|-------------|-------------|--------------|-------------·
```
