pragma solidity ^0.4.10;  // require added

contract Splitter
{
    address public owner;

    struct Balance
    {
      address user_address;
      uint256 amount;
    }

    uint constant USER_LIMIT = 5;
    Balance[5] public user_balances;
    uint public user_balances_size;

    mapping (address => bool) user_address_map;

    function Splitter()
    {
        owner = msg.sender;
    }

    function Send() payable
    returns (bool)
    {
        require(msg.value > 0);

        if (user_address_map[msg.sender] == false) {  // add new user
            require(user_balances_size <= USER_LIMIT); // limit reached

            user_address_map[msg.sender] = true;
            user_balances[user_balances_size] = Balance(msg.sender, msg.value);
            user_balances_size++;
        }

        return Split(msg.value, msg.sender);
    }

    function Split(uint256 amount, address sender) private
    returns (bool)
    {
        require(amount > 0);
        if (user_balances_size == 1) return true; // no need to split

        uint share_amount = amount / (user_balances_size - 1);
        require(share_amount > 0);                // should be positive amount

        for (uint i = 0; i < user_balances_size; i++)
        {
            if (user_balances[i].user_address == sender)
            {
                user_balances[i].amount +=
                  (amount - share_amount*user_balances_size);  // refund remainder
                continue;
            }
            user_balances[i].amount += share_amount;
        }

        return true;
    }

    function KillMe()
    returns (bool)
    {
        require(msg.sender == owner);

        suicide(owner);
    }
}
