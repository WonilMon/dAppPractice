// SPDX-License-Identifier: MIT
pragma solidity ^0.5.0;

contract Migrations {
    address public owner;
    uint public lastCompletedMigration;

    constructor() public{
        owner = msg.sender;
    }

    modifier restricted() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    function setCompleted(uint completed) public restricted {
        lastCompletedMigration = completed;
    }

    function upgrade(address newAddress) public restricted {
        Migrations upgraded = Migrations(newAddress);
        upgraded.setCompleted(lastCompletedMigration);
    }
}
