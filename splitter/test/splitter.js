var Splitter = artifacts.require("./Splitter.sol");

contract('Splitter', function(accounts) {
  var contract;
  var owner = accounts[0];

  beforeEach(function() {
    return Splitter.new({ from: owner })
    .then(function(instance) {
      contract = instance;
    });
  });

  it("should be owned by owner", function() {
    return contract.owner({from: owner})
      .then(function(_owner) {
          assert.equal(owner, _owner, "Owner of the contract is not right!");
      });
  });

  it("should kill the contract", function() {
    return contract.Send.call({from: owner, value: 1})
    .then(function(success) {
      assert.isTrue(success, "failed to send amount");
      return contract.KillMe().call({from: owner})
    })
    .then
  });

  it("should add 4 new accounts", function() {
    return contract.Send.call({ from: owner, value: 1 })
      .then(function(success1) {
        assert.isTrue(success1, "failed to send 1st amount");
        return contract.GetCountAccounts({ from: owner });
      })
      .then(function(count1) {
        console.log(count1)
        assert.equal(count1, 1, "1st account has not been added");
        return contract.Send.call({ from: accounts[1], value: 1});
      })
      .then(function(success2) {
        assert.isTrue(success2, "failed to send 2nd amount");
        return contract.GetCountAccounts({ from: owner });
      })
      .then(function(count2) {
        console.log(count2);
        assert.equal(count2, 2, "2nd account has not been added");
        return contract.Send.call({ from: accounts[2], value: 2});
      })
      .then(function(success3) {
        assert.isTrue(success3, "failed to send 3rd amount");
        return contract.GetCountAccounts({ from: accounts[2] });
      })
      .then(function(count3) {
        assert.equal(count3, 3, "3rd account has not been added");
        return contract.Send.call({ from: accounts[3], value: 2});
      })
      .then(function(success4) {
        assert.isFalse(success4, "didn't successfully cancel sending");
      })
  });

});
