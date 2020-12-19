const CryptoFantom = artifacts.require("CryptoFantom.sol");

module.exports = async function(deployer) {
  await deployer.deploy(CryptoFantom, "https://ftm.com");
  const game = await CryptoFantom.deployed();
  await Promise.all([
    game.mint(),
    game.mint(),
    game.mint(),
    game.mint()
  ]);
  console.log(await game.getAllFantoms());
};
