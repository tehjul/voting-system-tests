![Solidity](https://img.shields.io/badge/Solidity-%23363636.svg?style=for-the-badge&logo=solidity&logoColor=white)

![Node.js](https://img.shields.io/badge/Node.js-%339933.svg?style=for-the-badge&logo=nodedotjs&logoColor=black)

![https://github.com/tehjul](https://img.shields.io/badge/Compiler-0.8.13-blue?style=plastic)

Smart contract developed by [Cyril CASTAGNET](https://github.com/lecascyril)

# Getting started
## Dependencies

- NodeJS

## Installation
1. Truffle
```
npm install -g truffle
```
2. Install packages
```
npm install
```

## Launch tests

1. Launch Ganache in a separate terminal
```
ganache
```

2. Compile and deploy the smart contract
```
truffle migrate
```

3. Run tests
```
truffle test
```

# Voting system unit tests project
Pour réaliser les tests, j'ai choisi classer les tests à l'aide de **describe** dans des sections qui reprennent la même structure que le smart contract :
***
:::::::::: GETTERS ::::::::::

- getVoter
- getOneProposal
***
:::::::::: REGISTRATION ::::::::::

- addVoter
***
:::::::::: PROPOSAL ::::::::::

- addProposal
***
:::::::::: VOTE ::::::::::

- setVote
***
:::::::::: STATE ::::::::::

- startProposalsRegistering
- endProposalsRegistering
- startVotingSession
- endVotingSession
- tallyVotes
***
\
Pour chaque méthode, je teste le ou les **modifier**, puis les **require** un par un, ensuite le coeur de la **fonction** qui peut effectuer une ou plusieurs actions, et pour finir les éventuels **event**.
\
Des commentaires ont été ajoutés devant chaque bloc de test afin de se repérer plus facilement.

***
\
Enfin j'ai ajouté le package **eth-gas-reporter** afin d'avoir un apercu du cout en gas du déploiement et de chaque fonctions. J'ai ajouté quelques options afin de visualiser le cout en dollar, mais je les ai volontairement commentées car cela nécéssite une clé API.
```bash
·------------------------------------------|----------------------------|-------------|----------------------------·
|   Solc version: 0.8.13+commit.abaa5c0e   ·  Optimizer enabled: false  ·  Runs: 200  ·  Block limit: 6718946 gas  │
···········································|····························|·············|·····························
|  Methods                                 ·               14 gwei/gas                ·      1548.23 usd/eth       │
·············|·····························|··············|·············|·············|··············|··············
|  Contract  ·  Method                     ·  Min         ·  Max        ·  Avg        ·  # calls     ·  usd (avg)  │
·············|·····························|··············|·············|·············|··············|··············
|  Voting    ·  addProposal                ·           -  ·          -  ·      59208  ·          20  ·       1.28  │
·············|·····························|··············|·············|·············|··············|··············
|  Voting    ·  addVoter                   ·           -  ·          -  ·      50220  ·          47  ·       1.09  │
·············|·····························|··············|·············|·············|··············|··············
|  Voting    ·  endProposalsRegistering    ·           -  ·          -  ·      30599  ·          29  ·       0.66  │
·············|·····························|··············|·············|·············|··············|··············
|  Voting    ·  endVotingSession           ·           -  ·          -  ·      30533  ·          14  ·       0.66  │
·············|·····························|··············|·············|·············|··············|··············
|  Voting    ·  setVote                    ·           -  ·          -  ·      78013  ·          13  ·       1.69  │
·············|·····························|··············|·············|·············|··············|··············
|  Voting    ·  startProposalsRegistering  ·           -  ·          -  ·      94840  ·          44  ·       2.06  │
·············|·····························|··············|·············|·············|··············|··············
|  Voting    ·  startVotingSession         ·           -  ·          -  ·      30554  ·          25  ·       0.66  │
·············|·····························|··············|·············|·············|··············|··············
|  Voting    ·  tallyVotes                 ·           -  ·          -  ·      60661  ·           7  ·       1.31  │
·············|·····························|··············|·············|·············|··············|··············
|  Deployments                             ·                                          ·  % of limit  ·             │
···········································|··············|·············|·············|··············|··············
|  Voting                                  ·           -  ·          -  ·    1970027  ·      29.3 %  ·      42.70  │
·------------------------------------------|--------------|-------------|-------------|--------------|-------------·
```
