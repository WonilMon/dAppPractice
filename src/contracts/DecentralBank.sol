pragma solidity ^0.5.0;
import './RWD.sol';
import './Tether.sol';

contract DecentralBank {
    string public name = 'Decentral Bank';
    address public owner;
    Tether public tether;
    RWD public rwd;

    constructor (RWD _rwd, Tether _tether) public {
        rwd = _rwd;
        tether = _tether;
        owner = msg.sender;
    }

    address [] public stakers;

    mapping (address => uint) public stakingBalance;
    mapping (address => bool) public hasStaking;
    mapping (address => bool) public isStaking; 

    // stake Tokens
    function depositTokens (uint _amount) public {
        require(_amount > 0, 'amount cannot be 0');
        tether.transferFrom(msg.sender, address(this), _amount);

        stakingBalance[msg.sender] += _amount;

        if(!hasStaking[msg.sender]) {
            stakers.push(msg.sender);
        }

        hasStaking[msg.sender] = true;
        isStaking[msg.sender] = true;
    }
    
    // Unstake tokens
    function unstakeTokens () public {
        uint balance = stakingBalance[msg.sender];
        require(balance > 0, 'staking balance cannot to be greater than zero');

        // Transfer the tokens to the specified contract address from our bank
        tether.transfer(msg.sender, balance);
        // Reset staking balance
        stakingBalance[msg.sender] = 0;
        // Update staking status
        isStaking[msg.sender] = false;
    }

    // Issue rewards
    function issueTokens () public {
        require(msg.sender == owner, 'caller must be the owner');
        for (uint i = 0 ;i < stakers.length; i++) {
            address recipient = stakers[i];
            uint balance = stakingBalance[recipient] / 20;
            if (balance > 0) {
                rwd.transfer(recipient, balance);
            }
        }
    }
}