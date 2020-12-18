const CryptoFantom = artifacts.require("CryptoFantomGame.sol");

module.exports = function (deployer) {
  deployer.deploy(CryptoFantom, "https://url-to-your-game-server");
};
