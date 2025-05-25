import React, { useState, useEffect } from 'react';

const KYCView = ({ kyc, account }) => {
  const [status, setStatus] = useState('');
  const [adminInput, setAdminInput] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');

  const statusMap = ['Pending', 'Approved', 'Rejected'];

  const fetchStatus = async () => {
    try {
      const result = await kyc.methods.getStatus(account).call();
      setStatus(statusMap[result] || 'None');
    } catch (err) {
      console.error('Error fetching status:', err);
    }
  };

  useEffect(() => {
    if (kyc && account) {
      fetchStatus();
      checkIfAdmin();
    }
  }, [kyc, account]);

  const checkIfAdmin = async () => {
    try {
      const admin = await kyc.methods.admin().call();
      setIsAdmin(admin.toLowerCase() === account.toLowerCase());
    } catch (err) {
      console.error('Error checking admin:', err);
    }
  };

  const apply = async () => {
    try {
      if (!name || !dob) {
        alert('이름과 생년월일을 모두 입력해주세요!');
        return;
      }

      await kyc.methods.submitKYC(name, parseInt(dob)).send({ from: account });
      alert('✅ 신청 완료!');
      fetchStatus();
    } catch (err) {
      console.error('❌ 신청 실패 이유:', err);
      alert('❌ 신청 실패: ' + err.message);
    }
  };

  const approve = async () => {
    try {
      await kyc.methods.approveKYC(adminInput).send({ from: account });
      alert('✅ 승인 완료');
    } catch {
      alert('❌ 승인 실패');
    }
  };

  const reject = async () => {
    try {
      await kyc.methods.rejectKYC(adminInput).send({ from: account });
      alert('❌ 거절 완료');
    } catch {
      alert('❌ 거절 실패');
    }
  };

  return (
    <div className="mt-6 p-4 bg-[#e6fff7] rounded-lg shadow">
      <h4 className="text-lg font-bold mb-2">🔐 KYC 인증</h4>
      <p className="mb-2">
        현재 상태: <strong>{status}</strong>
      </p>

      <div className="mb-4">
        <input
          type="text"
          placeholder="이름 (예: 홍길동)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded w-full mb-2 text-sm"
        />
        <input
          type="number"
          placeholder="생년월일 8자리 (예: 19900101)"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          className="border p-2 rounded w-full text-sm"
        />
        <button
          onClick={apply}
          className="mt-2 w-full px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          📩 신청하기
        </button>
      </div>

      {isAdmin && (
        <div className="mt-4">
          <h5 className="font-semibold mb-1">👤 관리자 승인/거절</h5>
          <input
            type="text"
            placeholder="지갑 주소 입력"
            value={adminInput}
            onChange={(e) => setAdminInput(e.target.value)}
            className="border p-1 mr-2 rounded text-sm"
          />
          <button
            onClick={approve}
            className="px-2 py-1 bg-green-500 text-white rounded mr-2 hover:bg-green-600"
          >
            승인
          </button>
          <button
            onClick={reject}
            className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            거절
          </button>
        </div>
      )}
    </div>
  );
};

export default KYCView;
