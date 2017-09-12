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

  // Check contract is owned only by owner
  it("should be owned by owner", function() {
    return contract.owner({from: owner})
      .then(_owner => {
          assert.equal(owner, _owner, "Owner of the contract is not right!");
      });
  });

  // Kill contract and try to send amount
  it("should kill the contract", function() {
    return contract.KillMe({from: owner})
      .then(function(txn) {
          return contract.Send.call({from: alice, value: 1})
          .then(success => {
            assert.isFalse(success, "sent the amount to contract after killing it!");
          });
      });
  })

});
