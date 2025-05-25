import React, { useEffect, useState } from 'react';
import Web3 from 'web3';

const BallotView = ({ ballot, account }) => {
  const [proposals, setProposals] = useState([]);
  const [winner, setWinner] = useState(null);
  const [newVoter, setNewVoter] = useState('');
  const [chairperson, setChairperson] = useState('');
  const [delegateTo, setDelegateTo] = useState('');
  const [voterStatus, setVoterStatus] = useState(null);

  // Proposals
  useEffect(() => {
    const loadProposals = async () => {
      try {
        const count = 3; // 'Increase Staking Rate', 'Add New Token', 'Enable Multisig Withdrawal'
        const loadedProposals = [];

        for (let i = 0; i < count; i++) {
          const proposal = await ballot.methods.proposals(i).call();
          loadedProposals.push({
            index: i,
            name: Web3.utils.hexToUtf8(proposal.name),
            voteCount: proposal.voteCount,
          });
        }

        setProposals(loadedProposals);
      } catch (err) {
        console.error('❌ Error loading proposals:', err);
      }
    };

    if (ballot && ballot.methods) {
      loadProposals();
    }
  }, [ballot]);

  // Load chairperson
  useEffect(() => {
    const loadChairperson = async () => {
      try {
        const cp = await ballot.methods.chairperson().call();
        setChairperson(cp);
      } catch (err) {
        console.error('❌ Error loading chairperson');
      }
    };
    if (ballot && ballot.methods) {
      loadChairperson();
    }
  }, [ballot]);

  // Vote status
  useEffect(() => {
    const loadVoterStatus = async () => {
      try {
        const voter = await ballot.methods.voters(account).call();
        let status = 'no_right';

        if (voter.weight > 0 && !voter.voted && voter.vote == 0) {
          status = 'can_vote';
        }
        if (voter.voted) {
          status = 'voted';
        }
        if (voter.weight > 0 && voter.vote == 0 && !voter.voted) {
          status = 'can_vote';
        }

        setVoterStatus(status);
      } catch (err) {
        console.error('❌ Error fetching voter status:', err);
      }
    };

    if (ballot && account) {
      loadVoterStatus();
    }
  }, [ballot, account]);

  // Vote
  const vote = async (index) => {
    try {
      await ballot.methods.vote(index).send({ from: account });
      alert(`✅ Voted for proposal #${index}`);
    } catch (err) {
      alert('❌ Voting failed. Maybe already voted or no rights.');
    }
  };

  // Get winner
  const getWinner = async () => {
    try {
      const winnerName = await ballot.methods.winningName().call();
      setWinner(Web3.utils.hexToUtf8(winnerName));
    } catch (err) {
      alert('❌ Failed to load winner.');
    }
  };

  // Give right to vote
  const giveRightToVote = async () => {
    try {
      await ballot.methods.giveRightToVote(newVoter).send({ from: account });
      alert(`✅ Success : ${newVoter}`);
      setNewVoter('');
    } catch (err) {
      alert('❌ Failed to access');
    }
  };

  // Handle delegate
  const handleDelegate = async () => {
    try {
      await ballot.methods.delegate(delegateTo).send({ from: account });
      alert(`✅ Successfully delegated to ${delegateTo}`);
      setDelegateTo('');
    } catch (err) {
      alert('❌ Delegation failed. Are you eligible to delegate?');
    }
  };

  return (
    <div className="bg-white/90 text-[#1f2e2d] p-6 rounded-xl shadow-md mt-6">
      <h3 className="text-xl font-bold mb-4">🗳 Vote List</h3>
      <ul className="space-y-2">
        {proposals.map((p) => (
          <li
            key={p.index}
            className="flex items-center justify-between bg-[#d0f7ec] px-3 py-2 rounded"
          >
            <span className="font-semibold">
              #{p.index} - {p.name}
            </span>
            <span className="text-sm">({p.voteCount} votes)</span>
            <button
              onClick={() => vote(p.index)}
              className="ml-4 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
            >
              Vote
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-6">
        <button
          onClick={getWinner}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          🏆 Check 「1st」
        </button>
        {winner && (
          <p className="mt-2 text-lg font-semibold">
            🔥 1st : <span className="text-green-700">{winner}</span>
          </p>
        )}
      </div>

      {account === chairperson && (
        <div className="mt-8">
          <h4 className="text-lg font-bold mb-2">
            👑 Give right to vote (Chairperson Only)
          </h4>
          <input
            type="text"
            value={newVoter}
            onChange={(e) => setNewVoter(e.target.value)}
            placeholder="0x..."
            className="w-full px-3 py-2 border border-gray-300 rounded mb-2"
          />
          <button
            onClick={giveRightToVote}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            ➕ Give right to vote
          </button>
        </div>
      )}
      <div className="mt-6">
        <h4 className="text-lg font-semibold mb-2">🤝 Delegate Vote</h4>
        <input
          type="text"
          placeholder="0x... address"
          value={delegateTo}
          onChange={(e) => setDelegateTo(e.target.value)}
          className="border px-3 py-1 w-full rounded text-black mb-2"
        />
        <button
          onClick={handleDelegate}
          className="bg-purple-600 text-white px-4 py-2 rounded"
        >
          Delegate
        </button>
        {voterStatus && (
          <div className="mt-4 p-2 border border-gray-300 rounded text-sm">
            {voterStatus === 'voted' && <p>🗳 You have already voted.</p>}
            {voterStatus === 'can_vote' && <p>✅ You can vote now.</p>}
            {voterStatus === 'no_right' && (
              <p>❌ You don't have the right to vote.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BallotView;
