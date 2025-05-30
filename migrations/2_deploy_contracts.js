const Tether = artifacts.require('Tether');
const RWD = artifacts.require('RWD');
const DecentralBank = artifacts.require('DecentralBank');
const Ballot = artifacts.require('Ballot');
const KYC = artifacts.require('KYC');

module.exports = async function (deployer, network, accounts) {
  // Deploy Mock Tether Contract
  await deployer.deploy(Tether);
  const tether = await Tether.deployed();

  // Deploy Mock RWD Contract
  await deployer.deploy(RWD);
  const rwd = await RWD.deployed();

  // Deploy DecentralBank Contract
  await deployer.deploy(DecentralBank, rwd.address, tether.address);
  const decentralBank = await DecentralBank.deployed();

  // Deploy Ballot Contract with proposals
  const proposals = [
    'Increase Staking Rate',
    'Add New Token1',
    'Add New Token2',
    'Enable Multisig Withdrawal',
  ].map((name) => web3.utils.asciiToHex(name));
  await deployer.deploy(Ballot, proposals);
  const ballot = await Ballot.deployed();

  await deployer.deploy(KYC);
  const kyc = await KYC.deployed();

  // Transfer all RWD token to Decentral Bank
  await rwd.transfer(decentralBank.address, '1000000000000000000000000');

  // Distribute 100 Tether Tokens to investor
  await tether.transfer(accounts[1], '100000000000000000000');
};
