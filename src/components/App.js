// import React, { Component } from 'react';
// import Navbar from './Navbar';
// import Web3 from 'web3';
// import Tether from '../truffle_abis/Tether.json';
// import RWD from '../truffle_abis/RWD.json';
// import DecentralBank from '../truffle_abis/DecentralBank.json';
// import './App.css';

// class App extends Component {

//     // mount before rendering
//     async UNSAFE_componentWillMount () {
//         await this.loadWeb3()
//         await this.loadBlockchainData()
//     }

//     async loadWeb3() {
//         if(window.ethereum) {
//             window.web3 = new Web3(window3.ethereum)
//             await window.ethereum.enable()
//         } else if (window.web3) {
//             window.web3 = new Web3(window.web3.currentProvider)
//         } else {
//             window.alert('No ethereum browser detected! You can check out MetaMask!')
//         }
//     }

//     async loadBlockchainData () {
//         const web3 = new window.web3
//         const account = await web3.eth.getAccount()
//         this.setState({account : account[0]} )

//         // Load network ID
//         const networkId = await web3.eth.net.getId()
//         // Load Tether Contract
//         const tetherData = Tether.networks[networkId]
//         if(tetherData) {
//             const tether = new web3.eth.Contract(Tether.abi, tetherData.address)
//             this.setState({tether})
//             let tetherBalance = await tether.methods.balanceOf(this.state.account).call()
//             this.setState({tetherBalance : tetherBalance.toString()})
//         } else {
//             window.alert('Error! Tether contract not deployed - no detected network!')
//         }
//         // Load RWD Contract
//         const rwdData = RWD.networks[networkId]
//         if (rwdData) {
//             const rwd = new web3.eth.Contract(RWD.abi, rwdData.address)
//             this.setState({rwd})
//             let rwdBalance = await rwd.methods.balanceOf(this.state.account).call()
//             this.setState({rwdBalance : rwdBalance.toString()})
//         } else {
//             window.alert('Error! RWD contract not deployed - no detected network!')
//         }
//         // Load DecentralBank Contract
//         const decentralBankData = DecentralBank.networks[networkId]
//         if (decentralBankData) {
//             const decentralBank = new web3.eth.Contract(DecentralBank.abi, decentralBankData.address)
//             this.setState({decentralBank})
//             let stakingBalance = await decentralBank.methods.stakingBalance(this.state.account).call()
//             this.setState({stakingBalance : stakingBalance.toString()})
//         } else {
//             window.alert('Error! DecentralBank contract not deployed - no detected network!')
//         }

//         this.setState({loading : false} )
//     }

//   constructor(props) {
//     super(props);
//     this.state = {
//       account: '0x0',
//       tether : {},
//       rwd : {},
//       decentralBank : {},
//       tetherBalance : '0',
//       rwdBalance : '0',
//       stakingBalance : '0',
//       loading : true
//     };
//   }

//   //Our React code Goes In Here!
//   render() {
//     return (
//       <div>
//         <Navbar account={this.state.account}>
//           <div className="text-center">
//             <h></h>
//           </div>
//         </Navbar>
//       </div>
//     );
//   }
// }

// export default App;

import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import Navbar from './Navbar';
import Tether from '../truffle_abis/Tether.json';
import RWD from '../truffle_abis/RWD.json';
import DecentralBank from '../truffle_abis/DecentralBank.json';
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
      <div className="text-center">
        {loading ? (
          <h1>Loading...</h1>
        ) : (
          <>
            <h1>Welcome to Decentralized Bank</h1>
            <p>Tether Balance: {tetherBalance}</p>
            <p>RWD Balance: {rwdBalance}</p>
            <p>Staking Balance: {stakingBalance}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default App;
