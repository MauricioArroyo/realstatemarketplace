Real Estate Marketplace
=======================

The capstone will build upon the knowledge you have gained in the course in
order to build a decentralized housing product.

Project Steps
-------------

1.  Clone the project repository

Dependencies

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
truffle, 5.5.31
ganache, 7.4.3
Node, 16.17.1
@truffle/hdwallet-provider, 2.0.14
truffle-assertions, 0.9.2
dotenv, 16.0.2
openzeppelin-solidity, 4.6.0
solc, 0.8.17
solc-js, 1.0.1
web3, 1.8.0
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

To install and compile the contracts, run the following commands:

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ bash
npm install
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Unit Tests
--------------------

I created unit tests for the requested functionality. To check those tests you
need to start ganache in a terminal with the following command.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ bash
ganache -a 40 -l 9999999 -m "candy maple cake sugar pudding cream honey rich smooth crumble sweet treat"
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Then execute the tests running, this command compiles and then tests the
contracts:

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ bash
truffle test
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

![](images/UnitTesting.jpg)

Implement ZoKrates
------------------

-   Step 1: Install and execute Docker

-   Step 2: Run ZoKrates (you need to change the directory for the one where you
    have the project cloned.

    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    docker run -v E:\codePlayground\Blockchain\realstatemarketplace\Blockchain-Capstone\zokrates\code:/home/zokrates/code -ti zokrates/zokrates /bin/bash
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    Change into the square directory

    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    cd code/square/
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

-   Step 3: Compile the program written in ZoKrates DSL

    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    ~/zokrates compile -i square.code
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

-   Step 4: Generate the trusted setup

    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    ~/zokrates setup
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

-   Step 5: Compute witness. I created 10 proofs in the sub directory of the
    same name for the values from 2 to 12 and their corresponding square value.

    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    ~/zokrates compute-witness -a 2 4
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

![](images/proofs.jpg)

-   Step 6: Generate proof

    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    ~/zokrates generate-proof
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

-   Step 7: Export verifier

    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    ~/zokrates export-verifier --output proof2_4.json
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Deployment to Goerli
--------------------

The original description of the project talks about deploying to Rinkeby, but
opensea works now with Goerli, so I deployed and tested using this test network.

If you are running this process again, you need to change the file .env, to
specify the corresponding values. After migrating the contracts to Goerli (this
network setup is included in the truffle-config.js file.

To deploy the contracts

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
cd eth-contracts
truffle migrate --reset --network goerli
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The main contract SolnSquareVerifier.sol, has the following address in my run:
0x65B1989DF4dBc6CF7af6d1c91b1d1C2df48B53A0

Minting Tokens
--------------

I used the open sea template code to generate the mint.js file in the root of
the project. This file uses the SolnSquareVerifier to generate 6 solutions and
mint the corresponding tokens. I only minted 6 because the uri provided for the
metadata only has info for tokens 0-5.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ bash
node mint.js
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

![](images/NodeMint.jpg)

Once the solutions are generated and the corresponding tokens are minted, the
result can be verified using Etherscan with the Goerli network.

![](images/TokensMinted.jpg)

OpenSea
-------

I tested each individual token using the route (changing the value \<token_id\>
for the values 0-5, shown in the previous image)

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
https://testnets.opensea.io/assets/0x65B1989DF4dBc6CF7af6d1c91b1d1C2df48B53A0/<token_id>

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

In OpenSea, we can go to the collection and setup the listing for each one
specifying a sell value.

![](images/CollectionInMarketPlace.jpg)

Once the sell value is defined, each one will show it

![](images/Sales.jpg)

In the previous image, some show the value “last sale” because I used the
account 0x4415c895a07542a295646c9c7ca4A69a2d884e33 to buy the properties.
Generating the following 3 transactions. I didn’t buy 5 because I only minted 6
tokens, so I bought half.

The transactions hash for the buying are the following

-   0xf8c2ddee50d0f508be7c1cde35d459c0ca027db1bb4b67ca4c8f22fc8c21b6f4

-   0xd4097983fc52fec38059eab09ab8298090f8530b8476b14f4046fa30dfa3ddd7

-   0x76d2b87a135716dbac078e64bf0ba537cc15843b9e2b8d948281c7233ab20877
