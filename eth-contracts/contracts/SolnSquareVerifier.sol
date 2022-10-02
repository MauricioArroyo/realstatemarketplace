//SPDX-License-Identifier: CC BY-NC-ND 4.0
pragma solidity ^0.8.17;


import "./RealStateMarketPlaceToken.sol";
import "./verifier.sol";

// define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
// define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is RealStateMarketPlaceToken {
    Verifier verifier;

    // define a solutions struct that can hold an index & an address
    struct Solution {
        bytes32 index;
        uint256 tokenId;
        address account;
    }
    // define an array of the above struct
    mapping(uint256 => Solution) solutions;

    // define a mapping to store unique solutions submitted
    mapping(bytes32 => bool) verifiedSolutions;

    // Create an event to emit when a solution is added
    event SolutionAdded(bytes32 key, address account, uint256 tokenId);

    constructor(address verifierAddress) {
        verifier = Verifier(verifierAddress);
    }

    modifier solutionWasNotUsedBefore(uint256 tokenId, Verifier.Proof memory proof, uint[1] memory input)
    {
        bytes32 key = generateKey(tokenId, proof, input);
        require(!verifiedSolutions[key], "The solution is already registered");
        _;
    }

    modifier hasSolutionForToken(uint256 tokenId)
    {
        require(solutions[tokenId].account != address(0), "There is no solution for the given token");
        _;
    }

    modifier solutionBelongsToAccount(address account, uint256 tokenId)
    {
        require(solutions[tokenId].account == account, "Invalid account for minting token");
        _;
    }

    function generateKey(uint256 tokenId, Verifier.Proof memory proof, uint[1] memory input) internal pure returns(bytes32){
        bytes32 key = keccak256(
            abi.encodePacked(tokenId, proof.a.X, proof.a.Y, proof.b.X, proof.b.Y, proof.c.X, proof.c.Y, input)
        );
        return key;
    }

    // Create a function to add the solutions to the array and emit the event
    function addSolution(address account, uint256 tokenId, Verifier.Proof memory proof, uint[1] memory input) public solutionWasNotUsedBefore(tokenId, proof, input) {

        bool verificationResult = verifier.verifyTx(proof, input);
        require(verificationResult, "The proof is not valid");

        bytes32 key = generateKey(tokenId, proof, input);
        Solution memory solution = Solution(key, tokenId, account);
        solutions[tokenId] = solution;
        verifiedSolutions[key] = true;
        emit SolutionAdded(key, account, tokenId);
    }

    // Create a function to mint new NFT only after the solution has been verified
    //  - make sure the solution is unique (has not been used before)
    //  - make sure you handle metadata as well as tokenSuplly
    function mint(address account, uint256 tokenId) public hasSolutionForToken(tokenId) solutionBelongsToAccount(account, tokenId) override returns(bool) {
        return super.mint(account, tokenId);
    }
}

