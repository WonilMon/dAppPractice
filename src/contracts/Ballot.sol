// SPDX-License-Identifier: MIT
pragma solidity ^0.5.0;

contract Ballot {

    struct Voter {
        uint vote;
        bool voted;
        uint weight;
        address delegate; // 위임 대상 주소
    }

    struct Proposal {
        bytes32 name;
        uint voteCount;
    }

    Proposal[] public proposals;
    mapping(address => Voter) public voters;
    address public chairperson;

    constructor(bytes32[] memory proposalNames) public {
        chairperson = msg.sender;
        voters[chairperson].weight = 1;

        for (uint i = 0; i < proposalNames.length; i++) {
            proposals.push(Proposal({
                name: proposalNames[i],
                voteCount: 0
            }));
        }
    }

    // 👉 권한 부여
    function giveRightToVote(address voter) external {
        require(msg.sender == chairperson, "Only chairperson can give right to vote");
        require(!voters[voter].voted, "Voter already voted");
        require(voters[voter].weight == 0, "Already has voting rights");

        voters[voter].weight = 1;
    }

    // 🆕 위임 기능
    function delegate(address to) external {
        Voter storage sender = voters[msg.sender];
        require(!sender.voted, "Already voted");
        require(to != msg.sender, "Cannot delegate to self");

        // 순환 위임 방지
        while (voters[to].delegate != address(0)) {
            to = voters[to].delegate;
            require(to != msg.sender, "Found loop in delegation");
        }

        sender.voted = true;
        sender.delegate = to;

        Voter storage delegate_ = voters[to];
        if (delegate_.voted) {
            // 이미 투표했으면 즉시 반영
            proposals[delegate_.vote].voteCount += sender.weight;
        } else {
            // 아직 안했으면 가중치만 전달
            delegate_.weight += sender.weight;
        }
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
