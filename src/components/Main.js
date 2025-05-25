import React, { useRef } from 'react';
import Airdrop from './AirDrop';
import KYCView from './KYCView';

// import tether from '../tether.png';

const Main = ({
  tetherBalance,
  rwdBalance,
  stakingBalance,
  tether,
  rwd,
  ballot,
  kyc,
  decentralBank,
  account,
  stakeTokens,
  unstakeTokens,
}) => {
  const depositInput = useRef();

  return (
    <div id="content" className="mt-8 text-[#1f2e2d]">
      <table className="w-full text-center text-sm mb-6">
        <thead>
          <tr className="bg-[#d0f7ec]">
            <th className="py-2">Staking Balance</th>
            <th className="py-2">Reward Balance</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="py-2 font-mono text-lg">
              {window.web3.utils.fromWei(stakingBalance, 'Ether')}
            </td>
            <td className="py-2 font-mono text-lg">
              {window.web3.utils.fromWei(rwdBalance, 'Ether')}
            </td>
          </tr>
        </tbody>
      </table>

      <div className="bg-white/80 shadow-md rounded-lg p-6">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            let amount = depositInput.current.value.toString();
            amount = window.web3.utils.toWei(amount, 'Ether');
            stakeTokens(amount);
          }}
          className="space-y-4"
        >
          <div className="flex justify-between text-sm">
            <label className="font-semibold">Stake Tokens</label>
            <span>
              Balance: {window.web3.utils.fromWei(tetherBalance, 'Ether')}
            </span>
          </div>
          <div className="flex items-center border rounded overflow-hidden">
            <input
              ref={depositInput}
              type="text"
              placeholder="0"
              required
              className="flex-1 px-4 py-2 outline-none text-[#1f2e2d]"
            />
            <div className="flex items-center bg-[#589e7d] text-white px-3 text-sm">
              <img alt="tether" src={tether} height="24" className="mr-2" />{' '}
              USDT
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-[#589e7d] text-white font-semibold rounded hover:bg-[#4a8e70] transition"
          >
            DEPOSIT
          </button>
        </form>

        <button
          onClick={(event) => {
            event.preventDefault();
            unstakeTokens();
          }}
          className="w-full mt-3 py-2 bg-red-500 text-white font-semibold rounded hover:bg-red-600 transition"
        >
          WITHDRAW
        </button>

        <div className="text-center text-sm text-[#1f2e2d] mt-4">
          AIRDROP <Airdrop stakingBalance={stakingBalance} />
        </div>

        <KYCView kyc={kyc} account={account} />
      </div>
    </div>
  );
};

export default Main;
