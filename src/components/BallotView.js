import React, { useEffect, useState } from 'react';
import Web3 from 'web3';

const BallotView = ({ ballot, account }) => {
  const [proposals, setProposals] = useState([]);
  const [winner, setWinner] = useState(null);
  const [newVoter, setNewVoter] = useState('');
  const [chairperson, setChairperson] = useState('');

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

  return (
    <div className="text-black mt-5 p-4 bg-white rounded shadow">
      <h3 className="text-xl font-bold mb-4">🗳 Vote List</h3>
      <ul>
        {proposals.map((p) => (
          <li key={p.index} className="mb-2">
            <span className="font-semibold">
              #{p.index} - {p.name}
            </span>
            <span className="ml-2 text-sm">({p.voteCount} votes)</span>
            <button
              onClick={() => vote(p.index)}
              className="ml-4 px-2 py-1 bg-blue-500 text-white rounded"
            >
              Vote
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-6">
        <button
          onClick={getWinner}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          🏆 Check 「1st」
        </button>
        {winner && (
          <p className="mt-2 text-lg">
            🔥 1st : <strong>{winner}</strong>
          </p>
        )}
      </div>
      {/* Chairperson only voting rights UI */}
      {account === chairperson && (
        <div className="mt-8">
          <h4 className="text-lg font-bold">
            👑 Give right to vote (Chairperson Only)
          </h4>
          <input
            type="text"
            value={newVoter}
            onChange={(e) => setNewVoter(e.target.value)}
            placeholder="0x..."
            className="mt-2 px-3 py-1 w-full border rounded"
          />
          <button
            onClick={giveRightToVote}
            className="mt-2 px-4 py-2 bg-purple-600 text-white rounded"
          >
            ➕ Give right to vote
          </button>
        </div>
      )}
    </div>
  );
};

export default BallotView;
