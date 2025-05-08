// we can use in JS for Migration.sol
const Migrations = artifacts.require('Migrations');

//'Truffle' can use automatically function of deploy.
module.exports = function(deployer) {
  //Distribute Migration contract in Blockchain network (transaction occur)
  deployer.deploy(Migrations);
};
