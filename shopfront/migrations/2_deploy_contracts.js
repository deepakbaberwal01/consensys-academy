var Owned = artifacts.require("./Owned.sol");
var ShopFront = artifacts.require("./ShopFront.sol");

module.exports = function(deployer) {
  deployer.deploy(Owned);
  deployer.link(Owned, ShopFront);
  deployer.deploy(ShopFront);
};
