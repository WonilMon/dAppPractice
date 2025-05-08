const Tether = artifacts.require('Tether');
const RWD = artifacts.require('RWD');
const DecentralBank = artifacts.require('DecentralBank');

// Mocha frameWork of truffle is used in test.
// Chai library is good for using Assertion.
require('Chai')
  .use(require('chai-as-promised'))
  .should();

contract('decentralBank', ([owner, customer]) => {
  let tether, rwd, decentralBank;

  function tokens(number) {
    return web3.utils.toWei(number, 'ether');
  }

  // everything in 'before' runs before 'test' or 'describe'.
  before(async () => {
    // Load Contracts
    tether = await Tether.new();
    rwd = await RWD.new();
    decentralBank = await DecentralBank.new(rwd.address, tether.address);

    // Transfer all token to Decentral Bank (1 million)
    await rwd.transfer(decentralBank.address, tokens('1000000'));

    // Transfer 100 mock Tethers to Customer
    await tether.transfer(customer, tokens('100'), { from: owner });
  });

  // All of the code goes here for testing.
  describe('Mock Tether Deplpoyment', async () => {
    it('matches name successfully', async () => {
      const name = await tether.name();
      assert.equal(name, 'Mock Tether Token');
    });
  });

  describe('Reward Token', async () => {
    it('matches name successfully', async () => {
      const name = await rwd.name();
      assert.equal(name, 'Reward Token');
    });
  });

  describe('Decentral Bank Deplpoyment', async () => {
    it('matches name successfully', async () => {
      const name = await decentralBank.name();
      assert.equal(name, 'Decentral Bank');
    });

    it('contract has token', async () => {
      let balance = await rwd.balanceOf(decentralBank.address);
      assert.equal(balance, tokens('1000000'));
    });
  });

  describe('Yield Farming', async () => {
    it('rewards tokens for staking', async () => {
      let result;
      result = await tether.balanceOf(customer);
      assert.equal(
        result.toString(),
        tokens('100'),
        'customer mock wallet(tether) balance before staking',
      );

      await tether.approve(decentralBank.address, tokens('100'), {
        from: customer,
      });
      await decentralBank.depositBalance(tokens('100'), { from: customer });

      result = await tether.balanceOf(customer);
      assert.equal(
        result.toString(),
        tokens('0'),
        'customer mock wallet(tether) balance after staking',
      );

      result = await tether.balanceOf(decentralBank.address);
      assert.equal(
        result.toString(),
        tokens('100'),
        'decentralBank mock wallet(tether) balance after staking',
      );

      result = await decentralBank.isStaking(customer);
      assert.equal(
        result.toString(),
        'true',
        'customer is staking status after staking',
      );

      await decentralBank.issueTokens({ from: owner });
      await decentralBank.issueTokens({ from: customer }).should.be.rejected;
      await decentralBank.unstakeTokens({ from: customer });

      result = await tether.balanceOf(customer);
      assert.equal(
        result.toString(),
        tokens('100'),
        'customer mock wallet(tether) balance after unstaking',
      );

      result = await tether.balanceOf(decentralBank.address);
      assert.equal(
        result.toString(),
        tokens('0'),
        'decentralBank mock wallet(tether) balance after unstaking',
      );

      result = await decentralBank.isStaking(customer);
      assert.equal(
        result.toString(),
        'false',
        'customer is no longer staking  after unstaking',
      );
    });
  });
});
