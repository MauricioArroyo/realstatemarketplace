//migrating the appropriate contracts
var Verifier = artifacts.require("../contracts/verifier.sol");
var SolnSquareVerifier = artifacts.require("../contracts/SolnSquareVerifier.sol");
var RealStateMarketPlaceToken = artifacts.require("../contracts/RealStateMarketPlaceToken.sol");

module.exports = async function(deployer) {
  await deployer.deploy(RealStateMarketPlaceToken);
  await deployer.deploy(Verifier);
  const verifierContract = await Verifier.deployed();
  deployer.deploy(SolnSquareVerifier, verifierContract.address);
};
