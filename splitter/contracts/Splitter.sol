pragma solidity ^0.4.10;  // require added

contract Splitter
{
    address public owner;
    mapping (address => uint) public  balances;

    event LogSplit(address sender, uint remiander, address receiver1, address receiver2, uint share_amount);
    event LogWithdraw(address receiver);

    function Splitter()
    {
        owner = msg.sender;
    }

    // send and split it into 2 accounts
    // remainder will be added to sender's account
    function sendAndSplit(address receiver1, address receiver2)
    payable
    public
    returns (bool)
    {
        require(msg.value > 0);

        uint share_amount = msg.value / 2;
        balances[receiver1] += share_amount;
        balances[receiver2] += share_amount;

        uint remainder = msg.value - share_amount*2;
        balances[msg.sender] += remainder; // remainder refund

        LogSplit(msg.sender, remainder, receiver1, receiver2, share_amount);

        return true;
    }

    // withdraw its amount gained by splits
    // prevents re-entrace attack
    function withdraw()
    public
    {
        uint amount = balances[msg.sender];
        if (amount > 0)
        {
            balances[msg.sender] = 0;
            if(msg.sender.send(amount) == false) revert();

            LogWithdraw(msg.sender);
        }
    }

    function killMe()
    public
    {
        require(msg.sender == owner);

        suicide(owner);
    }
}
