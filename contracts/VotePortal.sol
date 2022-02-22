// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

// ["Option1", "Option2"]

contract VotePortal {

    struct Vote {
        string option;
        uint count;
    }

    uint256 totalVotes;
    Vote[] public votes;
    string[] public options;
    mapping(string => Vote) public votesMap;

    constructor(string[] memory _options) {
        options = _options;
        for (uint8 i = 0; i < _options.length; i += 1) {
            votes.push(Vote(_options[i], 0));
            votesMap[_options[i]] = Vote(_options[i], 0);
        }
    }

    function vote(uint optionIndex) public {
        totalVotes += 1;
        votes[optionIndex].count += 1;
        console.log("%s has voted!", msg.sender);
    }

    function getVotes() public view returns (Vote[] memory) {
        return votes;
    }
}