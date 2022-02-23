// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

// ["Option1", "Option2"]

contract VotePortal {

    struct Vote {
        string option;
        uint count;
    }

    // New Vote event
    event NewVote(address indexed from, uint256 timestamp);


    uint256 totalVotes;
    Vote[] public votes;
    string[] public options;
    mapping(address => bool) voters;
    uint256 private randSeed;

    constructor(string[] memory _options) payable {
        options = _options;

        // Initialize votes arr
        for (uint8 i = 0; i < _options.length; i += 1) {
            votes.push(Vote(_options[i], 0));
        }

        // Set the initial seed
        randSeed = (block.timestamp + block.difficulty) % 100;
    }

    function vote(uint optionIndex) public {
        // Voters can only vote once!
        require(!voters[msg.sender], "ADDRESS_ALREADY_VOTED");

        totalVotes += 1;
        votes[optionIndex].count += 1;
        voters[msg.sender] = true;
        console.log("%s has voted!", msg.sender);

        emit NewVote(msg.sender, block.timestamp);

        // Generate a new seed for the next user that sends a vote
        randSeed = (block.difficulty + block.timestamp + randSeed) % 100;

        // Give a 20% chance that the voter wins the prize.
        if (randSeed <= 20) {
            console.log("%s Wins prize!", msg.sender);
            uint256 prizeAmount = 0.001 ether;
            require(prizeAmount <= address(this).balance, "CONTRACT_OUT_OF_FUNDS");
            (bool success,) = (msg.sender).call{value : prizeAmount}("");
            require(success, "ERROR_WITHDRAWING_CONTRACT_FUNDS");
        } else {
            console.log("%s Didn't win prize! :(", msg.sender);
        }
    }

    function getVotes() public view returns (Vote[] memory) {
        return votes;
    }
}