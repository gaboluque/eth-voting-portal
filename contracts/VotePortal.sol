// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract VotePortal {
    uint256 totalVotes;
    mapping(string => uint) votes;
    mapping(string => bool) options;

    constructor(string[] memory _options) {
        for (uint8 i = 0; i < _options.length; i += 1) {
            votes[_options[i]] = 0;
            options[_options[i]] = true;
        }
    }

    function vote(string memory option) public {
        require(options[option]);
        totalVotes += 1;
        votes[option] += 1;
        console.log("%s has voted!", msg.sender);
    }

    function getTotalVotes() public view returns (uint256) {
        console.log("We have %d total votes", totalVotes);
        return totalVotes;
    }

    function getTotalVotesForOption(string memory option) public view returns (uint256) {
        require(options[option]);
        console.log("Option `%s` has %d votes", option, votes[option]);

        return votes[option];
    }
}