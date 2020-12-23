const { ethers } = require('ethers');
const fs = require('fs');
const contracts = require('../app/src/contracts/CryptoFantom.json');

const secrets = JSON.parse(
  fs.readFileSync('.secrets').toString().trim(),
);
const provider = ethers.getDefaultProvider('https://xapi.testnet.fantom.network/lachesis');
const signer = new ethers.Wallet(secrets.private, provider);
async function deployNFT() {
  const factory = new ethers.ContractFactory(contracts.abi, contracts.bytecode, signer);

  const contract = await factory.deploy('localhost:3000');

  console.log(contract.address);
}

(async () => {
  await deployNFT();
})();
