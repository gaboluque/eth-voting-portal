// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract VotePortal2 {

    struct Vote {
        string option;
        uint count;
    }

    uint256 totalVotes;
    mapping(string => Vote) public votes;
    mapping(string => bool) options;
    string[] optionsArr;

    constructor(string[] memory _options) {
        optionsArr = _options;
        for (uint8 i = 0; i < _options.length; i += 1) {
            string memory currOption = _options[i];
            votes[currOption] = Vote(_options[i], 0);
            options[currOption] = true;
        }
    }

    function vote(string memory option) public {
        require(options[option]);
        totalVotes += 1;
        votes[option].count += 1;
        console.log("%s has voted!", msg.sender);
    }

    function getTotalVotes() public view returns (uint256) {
        console.log("We have %d total votes", totalVotes);
        return totalVotes;
    }

    function getTotalVotesForOption(string memory option) public view returns (uint256) {
        require(options[option]);
        console.log("Option `%s` has %d votes", option, votes[option].count);

        return votes[option].count;
    }
}