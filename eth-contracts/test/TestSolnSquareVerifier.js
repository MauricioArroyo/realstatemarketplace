const web3 = require('web3');
const truffleAssert = require('truffle-assertions');
const Verifier = artifacts.require('verifier');
const SolnSquareVerifier = artifacts.require('SolnSquareVerifier');
const proofData = require("../proofs/proof2_4.json");


contract('SolnSquareVerifier', accounts => {
  const owner = accounts[0];
  const tokenId = 1;
  var contract;
  describe('test SolnSquareVerifier contract', () => {
    beforeEach(async () => {
      const verifier = await Verifier.new({
        from: owner
      });
      contract = await SolnSquareVerifier.new(verifier.address, {
        from: owner
      });
    })


    describe('addSolution', () => {
      // Test if a new solution can be added for contract - SolnSquareVerifier
      it('test if a new solution can be added', async function () {
        let tx = await contract.addSolution(owner, 1, proofData.proof, proofData.inputs);
        truffleAssert.eventEmitted(tx, 'SolutionAdded', (ev) => {
          return ev.account === owner && ev.tokenId.toString() === "1" && ev.key === '0xf5b2d37a59d2219dadbb8c86275c45f7122c70bb73e78af0c96af945ca4107ae';
        });
      })
      describe('reverts', () => {
        it('when solution was used before', async () => {
          await contract.addSolution(owner, 1, proofData.proof, proofData.inputs);
          await truffleAssert.reverts(
            contract.addSolution(owner, 1, proofData.proof, proofData.inputs),
            "The solution is already registered"
          );
        })
      })
    })

    describe('mint', () => {
      // Test if an ERC721 token can be minted for contract - SolnSquareVerifier
      it('Test if an ERC721 token can be minted', async function () {
        await contract.addSolution(owner, 1, proofData.proof, proofData.inputs);
        await contract.mint(owner, 1);
      })
      describe('reverts', () => {
        it('when there is no solution for token', async () => {
          await truffleAssert.reverts(
            contract.mint(owner, 1),
            "There is no solution for the given token"
          );
        })
        it('solution belongs to another account', async () => {
          await contract.addSolution(accounts[1], 1, proofData.proof, proofData.inputs);
          await truffleAssert.reverts(
            contract.mint(accounts[2], 1),
            "Invalid account for minting token"
          );
        })
      })
    })
  });
})
