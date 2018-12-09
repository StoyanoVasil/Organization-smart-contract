pragma solidity ^0.4.22;

import "./Ownable.sol";

contract Organization is Ownable {
    // Define options
    struct Option {
        uint id;
        string name;
        uint votes;
    }
    // Define polls
    struct Poll {
        address owner;
        string title;
        uint optionsCount;
    }
    // Define mapping for members
    mapping(address => bool) private members;
    // Define mapping for board members
    mapping(address => bool) private boardMembers;
    // Keep track of board members number
    uint private boardCount;
    // Define counter that keeps track of poll number
    uint public pollsCount;
    // Define mappings that store polls and poll options
    mapping(uint => Poll) public polls;
    mapping(uint => mapping(uint => Option)) public pollOptions;
    // Define mapping that track who voted for which polls
    mapping(address => uint[]) private voted;

    function addMember(address _member) public onlyOwner {
        members[_member] = true;
    }

    function addBoardMember(address _member) public onlyOwner {
        require(boardCount < 5, "There can only be 5 board members");
        boardMembers[_member] = true;
        members[_member] = true;
        boardCount++;
    }

    function removeBoardMember(address _member) public onlyOwner {
        boardMembers[_member] = false;
        boardCount--;
    }

    function addPoll(string _title) public onlyBoard {
        polls[pollsCount] = Poll(msg.sender, _title, 0);
        pollsCount++;
    }

    function addOptionToPoll(uint _id, string _name) public {
        require(msg.sender == polls[_id].owner, "Only poll owner can add options");
        pollOptions[_id][polls[_id].optionsCount] = Option(polls[_id].optionsCount, _name, 0);
        polls[_id].optionsCount++;
    }

    function vote(uint _pollId, uint _optionId) public onlyMembers {
        require(polls[_pollId].owner != msg.sender, "Owners of the polls cannot vote");
        require(!hasVoted(msg.sender, _pollId), "Members are allowed to vote once per poll");
        pollOptions[_pollId][_optionId].votes++;
        voted[msg.sender].push(_pollId);
    }

    function hasVoted(address _sender, uint _id) private returns (bool) {
        for(uint i = 0; i < voted[_sender].length; i++) {
            if(voted[_sender][i] == _id) {
                return true;
            }
        }
        return false;
    }

    modifier onlyMembers() {
        require(members[msg.sender], "Only members can vote");
        _;
    }

    modifier onlyBoard() {
        require(boardMembers[msg.sender], "Only board members can create polls");
        _;
    }
}
