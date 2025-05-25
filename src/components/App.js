import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import Navbar from './Navbar';
import Tether from '../truffle_abis/Tether.json';
import RWD from '../truffle_abis/RWD.json';
import DecentralBank from '../truffle_abis/DecentralBank.json';
import Ballot from '../truffle_abis/Ballot.json';
import Main from './Main.js';
import ParticleSettings from './ParticleSettings.js';
import BallotView from './BallotView.js';

const App = () => {
  const [state, setState] = useState({
    account: '0x0',
    tether: {},
    rwd: {},
    decentralBank: {},
    ballot: {},
    tetherBalance: '0',
    rwdBalance: '0',
    stakingBalance: '0',
    loading: true,
  });

  useEffect(() => {
    const init = async () => {
      await loadWeb3();
      await loadBlockchainData();
    };
    init();
  }, []);

  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      alert(
        'No Ethereum browser detected! You should consider trying MetaMask!',
      );
    }
  };

  const loadBlockchainData = async () => {
    const web3 = window.web3;

    const accounts = await web3.eth.getAccounts();
    setState((prevState) => ({
      ...prevState,
      account: accounts[0],
    }));

    const networkId = await web3.eth.net.getId();
    console.log('🛰 Detected network ID:', networkId);
    console.log('🧱 Tether.networks:', Tether.networks);
    console.log('🎯 Matching deployed address:', Tether.networks[networkId]);

    const tetherData = Tether.networks[networkId];
    if (tetherData) {
      const tether = new web3.eth.Contract(Tether.abi, tetherData.address);
      const tetherBalance = await tether.methods.balanceOf(accounts[0]).call();
      setState((prevState) => ({
        ...prevState,
        tether,
        tetherBalance: tetherBalance.toString(),
      }));
    } else {
      alert('Error! Tether contract not deployed - no detected network!');
    }

    const rwdData = RWD.networks[networkId];
    if (rwdData) {
      const rwd = new web3.eth.Contract(RWD.abi, rwdData.address);
      const rwdBalance = await rwd.methods.balanceOf(accounts[0]).call();
      setState((prevState) => ({
        ...prevState,
        rwd,
        rwdBalance: rwdBalance.toString(),
      }));
    } else {
      alert('Error! RWD contract not deployed - no detected network!');
    }

    const decentralBankData = DecentralBank.networks[networkId];
    if (decentralBankData) {
      const decentralBank = new web3.eth.Contract(
        DecentralBank.abi,
        decentralBankData.address,
      );
      const stakingBalance = await decentralBank.methods
        .stakingBalance(accounts[0])
        .call();
      setState((prevState) => ({
        ...prevState,
        decentralBank,
        stakingBalance: stakingBalance.toString(),
      }));
    } else {
      alert(
        'Error! DecentralBank contract not deployed - no detected network!',
      );
    }

    const ballotData = Ballot.networks[networkId];
    if (ballotData) {
      const ballot = new web3.eth.Contract(Ballot.abi, ballotData.address);
      setState((prevState) => ({
        ...prevState,
        ballot,
      }));
    } else {
      alert('Error! Ballot contract not deployed - no detected network!');
    }

    setState((prevState) => ({
      ...prevState,
      loading: false,
    }));
  };
  // two function one that stakes and one that unstakes -
  // leverage our decentralBank contract - deposit tokens and unstaking
  // ALL Of This is for the staking:
  // depositTokens transferFrom ....
  // function approve transaction hash ------
  // STAKING FUNCTION ?? >> decentralBank.depositTokens(send transactionHash =>)

  // staking function
  const stakeTokens = async (amount) => {
    const { tether, decentralBank, account } = state;

    setState((prevState) => ({
      ...prevState,
      loading: true,
    }));
    await tether.methods
      .approve(decentralBank._address, amount)
      .send({ from: account })
      .on('transactionHash', (hash) => {
        decentralBank.methods
          .depositTokens(amount)
          .send({ from: account })
          .on('transactionHash', (hash) => {
            setState((prevState) => ({
              ...prevState,
              loading: false,
            }));
          });
      });
  };

  const unstakeTokens = async () => {
    const { decentralBank, account } = state;

    setState((prevState) => ({
      ...prevState,
      loading: true,
    }));

    await decentralBank.methods
      .unstakeTokens()
      .send({ from: account })
      .on('transactionHash', (hash) => {
        setState((prevState) => ({
          ...prevState,
          loading: false,
        }));
      });
  };

  const { account, tetherBalance, rwdBalance, stakingBalance, loading } = state;

  return (
    <div className="relative min-h-screen bg-[#d0f7ec] text-[#1f2e2d]">
      <ParticleSettings />
      <div className="relative z-10">
        <Navbar account={account} />
        <div className="flex justify-center items-start pt-20 px-4">
          <main className="w-full max-w-2xl bg-white/80 rounded-2xl shadow-xl p-6">
            {loading ? (
              <div className="text-center text-xl font-semibold">
                Loading PLEASE...
              </div>
            ) : (
              <Main
                tetherBalance={tetherBalance}
                rwdBalance={rwdBalance}
                stakingBalance={stakingBalance}
                decentralBank={state.decentralBank}
                tether={state.tether}
                rwd={state.rwd}
                account={account}
                stakeTokens={stakeTokens}
                unstakeTokens={unstakeTokens}
              />
            )}
            <BallotView ballot={state.ballot} account={state.account} />
          </main>
        </div>
      </div>
    </div>
  );
};

export default App;
