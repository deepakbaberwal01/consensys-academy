pragma solidity ^0.4.10;  // require

contract Owned {
    address owner;

    function Owned() {
        owner = msg.sender;
    }

    modifier fromOwner() {
        require(msg.sender == owner);

        _;
    }
}
