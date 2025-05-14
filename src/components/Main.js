import React, { useRef } from 'react';
import Airdrop from './AirDrop';
// import tether from '../tether.png';

const Main = ({
  tetherBalance,
  rwdBalance,
  stakingBalance,
  tether,
  rwd,
  decentralBank,
  account,
  stakeTokens,
  unstakeTokens,
}) => {
  const depositInput = useRef();

  return (
    <div id="content" className="mt-3">
      <table className="table text-muted text-center">
        <thead>
          <tr style={{ color: 'black' }}>
            <th scope="col">Staking Balance</th>
            <th scope="col">Reward Balance</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ color: 'black' }}>
            <th>{window.web3.utils.fromWei(stakingBalance, 'Ether')}</th>
            <th>{window.web3.utils.fromWei(rwdBalance, 'Ether')}</th>
          </tr>
        </tbody>
      </table>
      <div className="card mb-2" style={{ opacity: '.9' }}>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            let amount;
            amount = depositInput.current.value.toString();
            amount = window.web3.utils.toWei(amount, 'Ether');
            stakeTokens(amount);
          }}
          className="mb-3"
        >
          <div style={{ borderSpacing: '0 1em' }}>
            <label className="float-left" style={{ marginLeft: '15px' }}>
              <p>Stake Tokens</p>
            </label>
            <span className="float-right" style={{ marginRight: '8px' }}>
              Balance: {window.web3.utils.fromWei(tetherBalance, 'Ether')}
            </span>
            <div className="input-group mb-4">
              <input ref={depositInput} type="text" placeholder="0" required />
              <div className="input-group-open">
                <div className="input-group-text">
                  <img alt="tether" src={tether} height="32" />
                  &nbsp;&nbsp;&nbsp;USDT
                </div>
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-lg btn-block">
              DEPOSIT
            </button>
          </div>
        </form>
        <button
          type="submit"
          onClick={(event) => {
            event.preventDefault();
            unstakeTokens();
          }}
          className="btn btn-primary btn-lg btn-block"
        >
          WITHDRAW
        </button>
        <div className="card-body text-center" style={{ color: 'blue' }}>
          AIRDROP <Airdrop stakingBalance={stakingBalance} />
        </div>
      </div>
    </div>
  );
};

export default Main;
