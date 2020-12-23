const CryptoFantom = artifacts.require("CryptoFantom.sol");

module.exports = function (deployer) {
  deployer.deploy(CryptoFantom, "https://url-to-your-game-server");
};
