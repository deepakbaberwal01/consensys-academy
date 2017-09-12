var Splitter = artifacts.require("./Splitter.sol");

contract('Splitter', function(accounts) {
  var contract;
  var owner = accounts[0];

  var alice = accounts[0];  // owner
  var bob   = accounts[1];
  var carol = accounts[2];
  var david = accounts[3];

  beforeEach(function() {
    return Splitter.new({from: owner})
    .then(function(instance) {
      contract = instance;
    });
  });

  // Check contract is owned only by owner
  it("should be owned by owner", function() {
    return contract.owner({from: owner})
      .then(_owner => {
          assert.equal(owner, _owner, "Owner of the contract is not right!");
      });
  });

  it("should reject 0 amount request", function() {
    return contract.sendAndSplit.call(bob, alice)
      .then(success => {
        assert.isFalse(success, "didn't reject 0 amount!");
      });
  });

  it("should split sent amount (odd -> with remainder)", function() {
    var send_amount = web3.toWei(99, "wei");
    return contract.sendAndSplit(bob, carol, {from: alice, value: send_amount})
      .then(txn => {
        return contract.balances(bob);
      })
      .then(balance => {
        assert.equal(balance.toNumber(), 49, "Bob's (receiver1) balance is not correct.");
        return contract.balances(carol);
      })
      .then(balance => {
        assert.equal(balance.toNumber(), 49, "Carol's (receiver2) balance is not correct.");
        return contract.balances(alice);
      })
      .then(balance => {
        assert.equal(balance.toNumber(), 1, "Alice's (sender) balance is not correct. Remainder should have been added.");
      });
  });

  it("should split sent amount (even -> without remainder)", function() {
    var send_amount = web3.toWei(100, "wei");
    return contract.sendAndSplit(bob, carol, {from: alice, value: send_amount})
      .then(txn => {
        return contract.balances(bob);
      })
      .then(balance => {
        assert.equal(balance.toNumber(), 50, "Bob's (receiver1) balance is not correct.");
        return contract.balances(carol);
      })
      .then(balance => {
        assert.equal(balance.toNumber(), 50, "Carol's (receiver2) balance is not correct.");
        return contract.balances(alice);
      })
      .then(balance => {
        assert.equal(balance.toNumber(), 0, "Alice's (sender) balance is not empty.");
      });
  });

  it("should withdraw and remaining balance must be 0", function() {
    var send_amount = web3.toWei(1, "ether");
    var carol_amount = web3.toWei(0.5, "ether");
    return contract.sendAndSplit(bob, carol, {from: alice, value: send_amount})
      .then(txn => {
        return contract.balances(carol);
      })
      .then(balance => {
        assert.equal(balance.toNumber(), carol_amount, "Carol's amount is not correct!");
        return contract.withdraw({from: carol});
      })
      .then(txn => {
        return contract.balances(carol);
      })
      .then(balance => {
        assert.equal(balance.toNumber(), 0, "Carol's balance is not reset to 0!");
      });
  });

});
