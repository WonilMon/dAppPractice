const KYC = artifacts.require('KYC');

contract('KYC', (accounts) => {
  let kyc;

  const user = accounts[1];
  const admin = accounts[0];

  before(async () => {
    kyc = await KYC.new();
  });

  it('allows user to submit KYC', async () => {
    await kyc.submitKYC('Alice', 19900101, { from: user });
    const result = await kyc.users(user);

    assert.equal(result.name, 'Alice', 'Name should be Alice');
    assert.equal(result.dob.toNumber(), 19900101, 'DOB should be 19900101');
    assert.equal(result.status.toNumber(), 0, 'Status should be Pending');
  });

  it('admin can approve KYC', async () => {
    await kyc.approveKYC(user, { from: admin });
    const result = await kyc.users(user);
    assert.equal(result.status.toNumber(), 1, 'Status should be Approved');
  });

  it('admin can reject another user', async () => {
    const user2 = accounts[2];
    await kyc.submitKYC('Bob', 19951123, { from: user2 });
    await kyc.rejectKYC(user2, { from: admin });
    const result = await kyc.users(user2);
    assert.equal(result.status.toNumber(), 2, 'Status should be Rejected');
  });

  it('non-admin cannot approve or reject', async () => {
    try {
      await kyc.approveKYC(accounts[3], { from: accounts[3] });
      assert.fail('Non-admin should not be able to approve');
    } catch (error) {
      assert.ok(error.toString().includes('Only admin'));
    }
  });
});
