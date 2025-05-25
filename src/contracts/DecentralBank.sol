// SPDX-License-Identifier: MIT
pragma solidity ^0.5.0;

import "./RWD.sol";
import "./Tether.sol";

contract Ownable {
    address public owner;

    constructor() public {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
}

contract ReentrancyGuard {
    bool internal locked;

    modifier nonReentrant() {
        require(!locked, "No reentrancy");
        locked = true;
        _;
        locked = false;
    }
}

contract DecentralBank is Ownable, ReentrancyGuard {

    string public name = "Decentral Bank";
    Tether public tether;
    RWD public rwd;

    address[] public stakers;

    mapping(address => uint) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;
    mapping(address => uint) public depositTimestamp;

    constructor(RWD _rwd, Tether _tether) public {
        rwd = _rwd;
        tether = _tether;
    }

    function depositTokens(uint _amount) external nonReentrant {
        require(_amount > 0, "Amount cannot be 0");

        tether.transferFrom(msg.sender, address(this), _amount);

        stakingBalance[msg.sender] += _amount;
        depositTimestamp[msg.sender] = now;

        if (!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
            hasStaked[msg.sender] = true;
        }

        isStaking[msg.sender] = true;
    }

    function unstakeTokens() external nonReentrant {
        uint balance = stakingBalance[msg.sender];
        require(balance > 0, "Staking balance must be greater than 0");

        // 보상 계산: 시간차 (초) × 보상률
        uint stakingDuration = now - depositTimestamp[msg.sender]; // 초 단위
        uint reward = (stakingDuration * balance) / 1 weeks / 10; // 주 단위로 나눠서 10% 비율

        tether.transfer(msg.sender, balance);
        if (reward > 0) {
            rwd.transfer(msg.sender, reward);
        }

        stakingBalance[msg.sender] = 0;
        isStaking[msg.sender] = false;
        depositTimestamp[msg.sender] = 0;
    }
}
