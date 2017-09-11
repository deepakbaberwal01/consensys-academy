var Splitter = artifacts.require("./Splitter.sol");

contract('Splitter', function(accounts) {
  var contract;
  var owner = accounts[0];

  var alice = accounts[0];  // owner
  var bob   = accounts[1];
  var carol = accounts[2];
  var david = accounts[3];

  beforeEach(function() {
    return Splitter.new({ from: owner })
    .then(function(instance) {
      contract = instance;
    });
  });

  it("should be owned by owner", function() {
    return contract.owner({from: owner})
      .then(_owner => {
          assert.equal(owner, _owner, "Owner of the contract is not right!");
      });
  });

  it("should add 3 successful new accounts and 1 failed new account", function() {
    return contract.Send.call({from: alice, value: 1})
      .then(success => {
        assert.isTrue(success, "failed to send 1st amount");
        return contract.GetCountAccounts({from: alice});
      })
      .then(count => {
        assert.equal(count, 1, "1st account has not been added");
        return contract.Send.call({from: bob, value: 1});
      })
      .then(success => {
        assert.isTrue(success, "failed to send 2nd amount");
        return contract.GetCountAccounts({from: bob});
      })
      .then(count => {
        assert.equal(count, 2, "2nd account has not been added");
        return contract.Send.call({from: carol, value: 2});
      })
      .then(success => {
        assert.isTrue(success, "failed to send 3rd amount");
        return contract.GetCountAccounts({from: carol});
      })
      .then(count => {
        assert.equal(count, 3, "3rd account has not been added");
        return contract.Send.call({from: david, value: 2});
      })
      .then(success => {
        assert.isFalse(success, "didn't successfully cancel sending");
      })
  });

});
