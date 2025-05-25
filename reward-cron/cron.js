require('dotenv').config();
const Web3 = require('web3').default;
const cron = require('node-cron');
const fs = require('fs');
const path = require('path');

// 환경 변수
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const RPC_URL = process.env.RPC_URL;

// Web3 연결
const web3 = new Web3(RPC_URL);

// 계정 설정
const account = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY);
web3.eth.accounts.wallet.add(account);
web3.eth.defaultAccount = account.address;

// ABI 불러오기
const abiPath = path.join(__dirname, 'abi', 'DecentralBank.json');
const abi = JSON.parse(fs.readFileSync(abiPath, 'utf8')).abi;
const contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS);

// ⏰ 매 분마다 실행
cron.schedule('* * * * *', async () => {
  console.log(`⏰ ${new Date().toLocaleString()} - 보상 지급 시도 중...`);

  try {
    const gas = await contract.methods
      .issueTokens()
      .estimateGas({ from: account.address });
    const tx = await contract.methods.issueTokens().send({
      from: account.address,
      gas,
    });

    console.log('✅ 보상 지급 성공:', tx.transactionHash);
  } catch (err) {
    console.error('❌ 보상 지급 실패:', err.message);
  }
});

console.log('🔄 Cron script started. 매 분마다 issueTokens() 실행 중...');
