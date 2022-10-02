require('dotenv').config({
  path: './eth-contracts/.env'
})
const HDWalletProvider = require("@truffle/hdwallet-provider");
const web3 = require("web3");
const fs = require('fs');
const MNEMONIC = process.env.MNEMONIC;
const NODE_API_KEY = process.env.INFURA_KEY;
const FACTORY_CONTRACT_ADDRESS = process.env.FACTORY_CONTRACT_ADDRESS;
const OWNER_ADDRESS = process.env.OWNER_ADDRESS;
const NETWORK = process.env.NETWORK;
const NumTokensToMint = 6;
const proofs = [];

fs.readdirSync('./eth-contracts/proofs').filter(fn => fn.endsWith('.json')).forEach(file => {
  proofs.push(require('./eth-contracts/proofs/' + file));
});

if (!MNEMONIC || !NODE_API_KEY || !OWNER_ADDRESS || !NETWORK) {
  console.error(
    "Please set a mnemonic, Infura key, owner, network, and contract address."
  );
  return;
}

const FACTORY = require('./eth-contracts/build/contracts/SolnSquareVerifier.json')

async function main() {
  const network = process.env.NETWORK;
  const provider = new HDWalletProvider(MNEMONIC, "https://" + network + ".infura.io/v3/" + NODE_API_KEY);
  const web3Instance = new web3(provider);

  const factoryContract = new web3Instance.eth.Contract(
    FACTORY.abi,
    FACTORY_CONTRACT_ADDRESS,
    {
      gasLimit: "1000000"
    }
  );

  //console.log(proofs);
  //Creatures issued directly to the owner.
  for (var i = 0; i < NumTokensToMint; i++) {
    const proof = proofs[i].proof
    const inputs = proofs[i].inputs
    //console.log('proof', proof, 'inputs', inputs);
    const tx = await factoryContract.methods.addSolution(
      OWNER_ADDRESS,
      i,
      proof,
      inputs
    ).send({
      from: OWNER_ADDRESS
    });
    console.log("Solution Added. Transaction: " + tx.transactionHash)
    const tx2 = await factoryContract.methods
      .mint(OWNER_ADDRESS, i)
      .send({
        from: OWNER_ADDRESS
      });
    console.log("Minted token. Transaction: " + tx2.transactionHash);
  }
  process.exit();
}

main();
