import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import Navbar from './Navbar';
import Tether from '../truffle_abis/Tether.json';
import RWD from '../truffle_abis/RWD.json';
import DecentralBank from '../truffle_abis/DecentralBank.json';
import Main from './Main.js';
import './App.css';

const App = () => {
  const [state, setState] = useState({
    account: '0x0',
    tether: {},
    rwd: {},
    decentralBank: {},
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
      await window.ethereum.request({ method: 'eth_requestAccounts' });
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
    setState((prevState) => ({ ...prevState, account: accounts[0] }));

    const networkId = await web3.eth.net.getId();

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

    setState((prevState) => ({ ...prevState, loading: false }));
  };

  const { account, tetherBalance, rwdBalance, stakingBalance, loading } = state;

  return (
    <div>
      <Navbar account={account} />
      <div className='container-fluid mt-5'>
        <div className='row'>
            <main role='main' className='col-lg-12 ml-auto mr-auto' style={{maxWidth:'600px', minHeight:'100vm'}} >
                <div>
                    <Main/>
                </div>
            </main>
        </div>
      </div>
    </div>
  );
};

export default App;
