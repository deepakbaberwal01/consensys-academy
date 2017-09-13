var ShopFront = artifacts.require("./ShopFront.sol");

contract('ShopFront', function(accounts) {
    var contract;
    var owner = accounts[0];

    beforeEach(function() {
        return ShopFront.new({ from: owner })
        .then(_instance => {
            contract = _instance;
        });
    });

    it("should start with empty products", function() {
        return contract.products_size()
        .then(_size => {
            assert.equal(_size, 0, "It has non-zero products when it is created!");
        });
    });

    it("should add 1 product successfully", function() {
        return contract.addProduct.call(1, "test", 100)
        .then(_success => {
            assert.isTrue(_success, "failed to add a product!");
            return contract.addProduct(1, "test", 100);
        })
        .then(_txn => {
            return contract.products_size();
        })
        .then(_size => {
            assert.equal(_size, 1, "products size should be 1.");
            return contract.products(1);
        })
        .then(_values => {
            assert.equal(_values[0], "test", "product name is not correct!");
            assert.equal(_values[1].toNumber(), 100, "product price is not correct!");
        });
    });

    it("should allow only owner to add product", function() {
        return contract.addProduct.call(1, "test", 100, { from: accounts[1] })
        .then(_success => {
            assert.isFalse(_success, "non-owner added a product!");
        });
    });

});
