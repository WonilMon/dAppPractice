// SPDX-License-Identifier: MIT
pragma solidity ^0.5.0;

contract Ballot {

    struct Voter {
        uint vote;
        bool voted;
        uint weight;
    }

    struct Proposal {
        bytes32 name;
        uint voteCount;
    }

    Proposal[] public proposals;
    mapping(address => Voter) public voters;
    address public chairperson;

    constructor  (bytes32[] memory proposalNames) public{
        chairperson = msg.sender;
        voters[chairperson].weight = 1;

        for (uint i = 0; i < proposalNames.length; i++) {
            proposals.push(Proposal({
                name: proposalNames[i],
                voteCount: 0
            }));
        }
    }

    function giveRightToVote(address voter) external {
        require(msg.sender == chairperson, "Only chairperson can give right to vote");
        require(!voters[voter].voted, "Voter already voted");
        require(voters[voter].weight == 0, "Voter already has right");

        voters[voter].weight = 1;
    }

    function vote(uint proposal) external {
        Voter storage sender = voters[msg.sender];
        require(sender.weight != 0, "No right to vote");
        require(!sender.voted, "Already voted");

        sender.voted = true;
        sender.vote = proposal;
        proposals[proposal].voteCount += sender.weight;
    }

    function winningProposal() public view returns (uint winningProposalIndex) {
        uint winningVoteCount = 0;

        for (uint i = 0; i < proposals.length; i++) {
            if (proposals[i].voteCount > winningVoteCount) {
                winningVoteCount = proposals[i].voteCount;
                winningProposalIndex = i;
            }
        }
    }

    function winningName() external view returns (bytes32) {
        return proposals[winningProposal()].name;
    }
}
