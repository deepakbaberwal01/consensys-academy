pragma solidity ^0.4.10;  // require

import "./Owned.sol";

contract ShopFront is Owned
{
    struct Product
    {
        string name;
        uint price;
    }

    mapping(uint =>  Product) public products;
    uint public products_size;

    event LogProductAdded(uint id, string name, uint price);

    function ShopFront(){}

    function addProduct(uint id, string name, uint price)
        fromOwner
        returns (bool successful)
    {

        products[id] = Product
            ({
                name: name,
                price: price
            });

        products_size++;

        LogProductAdded(id, name, price);

        return true;
    }
}
