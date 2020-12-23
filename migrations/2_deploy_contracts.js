const CryptoFantom = artifacts.require('CryptoFantom.sol');

module.exports = async function (deployer) {
  await deployer.deploy(CryptoFantom, 'http://127.0.0.1:3000');
  const game = await CryptoFantom.deployed();
  await Promise.all([
    game.mint(),
    game.mint(),
    game.mint(),
  ]);
};
