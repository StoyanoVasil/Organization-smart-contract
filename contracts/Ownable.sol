pragma solidity ^0.4.22;

contract Ownable {
    address private _owner;
    
    constructor() internal {
        _owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == _owner, "Only the owner of the contract can perform this action!");
        _;
    }

    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0));
        _owner = newOwner;
    }
}
