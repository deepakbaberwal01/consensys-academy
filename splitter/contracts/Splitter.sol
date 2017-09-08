pragma solidity ^0.4.10;  // require added

contract Splitter
{
    address public owner;
    bool public is_killed;

    struct Balance
    {
      address user_address;
      uint256 amount;
    }
    Balance[] user_balances;

    mapping (address => bool) user_address_map;

    function Splitter()
    {
        owner = msg.sender;
    }

    function Send() payable
    returns (bool)
    {
        require(msg.value > 0);
        require(is_killed == false);

        if (user_address_map[msg.sender] == false) {  // add new user
            user_address_map[msg.sender] = true;
            user_balances.push(Balance(msg.sender, msg.value));
        }

        return Split(msg.value, msg.sender);
    }

    function Split(uint256 amount, address sender)
    returns (bool)
    {
        require(amount > 0);
        if (user_balances.length == 1) return true; // no need to split

        uint share_amount = amount / (user_balances.length - 1);
        require(share_amount > 0);

        for (uint i = 0; i < user_balances.length; i++)
        {
            if (user_balances[i].user_address == sender)
            {
                user_balances[i].amount +=
                  (amount - share_amount*user_balances.length);  // refund remainder
                continue;
            }
            user_balances[i].amount += share_amount;
        }

        return true;
    }

    function GetBalance(address user_address)
    constant returns (uint)
    {
        if (user_address_map[user_address] == false) return 0;

        for (uint i = 0; i < user_balances.length; i++)
        {
            if (user_balances[i].user_address == user_address)
            {
              return user_balances[i].amount;
            }
        }
    }

    function GetCountAccounts()
    public constant returns (uint)
    {
        return user_balances.length;
    }

    function killMe()
    returns (bool)
    {
        require(msg.sender == owner);
        require(is_killed == false);

        suicide(owner);
        is_killed = true;

        return true;
    }
}
