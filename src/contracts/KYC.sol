// SPDX-License-Identifier: MIT
pragma solidity ^0.5.0;

contract KYC {
    address public admin;

    enum Status { Pending, Approved, Rejected }

    struct User {
        string name;
        uint dob;
        Status status;
    }

    mapping(address => User) public users;

    event Submitted(address indexed user, string name, uint dob);
    event Approved(address indexed user);
    event Rejected(address indexed user);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }

    constructor() public {
        admin = msg.sender;
    }

    function submitKYC(string memory _name, uint _dob) public {
        users[msg.sender] = User({
            name: _name,
            dob: _dob,
            status: Status.Pending
        });

        emit Submitted(msg.sender, _name, _dob);
    }

    function approveKYC(address _user) public onlyAdmin {
        require(users[_user].status == Status.Pending, "Not pending");
        users[_user].status = Status.Approved;
        emit Approved(_user);
    }

    function rejectKYC(address _user) public onlyAdmin {
        require(users[_user].status == Status.Pending, "Not pending");
        users[_user].status = Status.Rejected;
        emit Rejected(_user);
    }

    function getStatus(address _user) public view returns (Status) {
        return users[_user].status;
    }
}
