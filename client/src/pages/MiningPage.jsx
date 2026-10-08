import React, { useState } from 'react';
import {
  Cpu,
  Pickaxe,
  Zap,
  Clock,
  Hash,
  CheckCircle2,
  AlertCircle,
  Coins,
  Layers,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function MiningPage({
  blockchain,
  status,
  wallets,
  onMine,
  onRefresh
}) {
  const [difficulty, setDifficulty] = useState(blockchain?.difficulty || 2);
  const [minerAddress, setMinerAddress] = useState(
    wallets?.[0]?.address || '0x1A88F3B9200109C482C318260D0429AA96B501A1'
  );
  const [isMining, setIsMining] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const [error, setError] = useState(null);

  const pendingTxs = blockchain?.pendingTransactions || [];
  const targetPrefix = '0'.repeat(difficulty);

  const handleStartMining = async () => {
    setIsMining(true);
    setError(null);
    try {
      const res = await onMine(minerAddress, difficulty);
      setLastResult(res);
    } catch (err) {
      setError(err.message || 'Mining process failed.');
    } finally {
      setIsMining(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white tracking-tight">Proof of Work (PoW) Mining Lab</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Topic 6
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Cryptographic puzzle solver: finds a nonce so that SHA-256(Block + Nonce) begins with{' '}
              <strong className="text-emerald-400 font-mono font-bold">"{targetPrefix}"</strong>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Mining Reward:</span>
            <span className="px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono font-bold text-sm">
              +50 EcoCoins
            </span>
          </div>
        </div>
      </div>

      {/* Mining Control Console */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Mining Parameters */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <Cpu className="w-5 h-5 text-teal-400" />
            <h2 className="text-base font-bold text-white">Mining Configuration</h2>
          </div>

          {/* Difficulty selector */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300">
              Proof of Work Difficulty (Leading Zeros)
            </label>
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setDifficulty(lvl)}
                  className={`py-2 rounded-lg text-xs font-bold transition border ${
                    difficulty === lvl
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-lg shadow-emerald-500/20'
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {lvl} {lvl === 1 ? 'Zero' : 'Zeros'}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-400">
              Target Prefix:{' '}
              <span className="font-mono text-emerald-400 font-bold bg-slate-950 px-2 py-0.5 rounded">
                "{targetPrefix}"
              </span>{' '}
              (Avg. searches: ~{Math.pow(16, difficulty).toLocaleString()})
            </p>
          </div>

          {/* Miner Wallet Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300">
              Miner Reward Beneficiary Wallet
            </label>
            <select
              value={minerAddress}
              onChange={(e) => setMinerAddress(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              {wallets?.map((w) => (
                <option key={w.id} value={w.address}>
                  {w.name} ({w.role})
                </option>
              ))}
            </select>
          </div>

          {/* Mine Button */}
          <button
            onClick={handleStartMining}
            disabled={isMining}
            className={`w-full py-3 px-4 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 shadow-xl ${
              isMining
                ? 'bg-emerald-700 text-slate-300 cursor-not-allowed animate-pulse'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
            }`}
          >
            <Pickaxe className={`w-5 h-5 ${isMining ? 'animate-spin' : ''}`} />
            <span>{isMining ? 'Mining in Progress (PoW)...' : 'Mine Block Now'}</span>
          </button>

          {error && (
            <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-600/40 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Center & Right Column: Mempool & Mined Output */}
        <div className="lg:col-span-2 space-y-6">
          {/* Last Mining Output Card */}
          {lastResult && (
            <div className="bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/40 rounded-2xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Block #{lastResult.minedBlock.index} Successfully Mined!</span>
                </div>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-semibold">
                  STATUS: SUCCESS
                </span>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800">
                  <span className="text-slate-400">Winning Nonce</span>
                  <div className="text-lg font-mono font-bold text-emerald-400 mt-1">
                    {lastResult.miningResult.nonce.toLocaleString()}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800">
                  <span className="text-slate-400">PoW Attempts</span>
                  <div className="text-lg font-mono font-bold text-teal-300 mt-1">
                    {lastResult.miningResult.attempts.toLocaleString()}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800">
                  <span className="text-slate-400">Mining Duration</span>
                  <div className="text-lg font-mono font-bold text-amber-300 mt-1">
                    {lastResult.miningResult.durationMs} ms
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800">
                  <span className="text-slate-400">Reward Credited</span>
                  <div className="text-lg font-mono font-bold text-emerald-400 mt-1">
                    +50 ECO
                  </div>
                </div>
              </div>

              {/* Hash display */}
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Mined SHA-256 Hash (Meets Difficulty Target)
                </div>
                <div className="font-mono text-xs break-all text-slate-300">
                  <span className="text-emerald-400 font-bold bg-emerald-950 px-1 rounded">
                    {lastResult.miningResult.hash.slice(0, difficulty)}
                  </span>
                  {lastResult.miningResult.hash.slice(difficulty)}
                </div>
              </div>
            </div>
          )}

          {/* Pending Transactions Mempool */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">Pending Transactions Mempool</h3>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 font-semibold border border-amber-500/20">
                {pendingTxs.length} Waiting
              </span>
            </div>

            {pendingTxs.length === 0 ? (
              <div className="text-center py-6 text-slate-500 text-xs">
                Mempool is currently empty. Next block will mine empty block data or system mining reward.
              </div>
            ) : (
              <div className="space-y-2">
                {pendingTxs.map((tx) => (
                  <div
                    key={tx.id}
                    className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="font-mono text-emerald-400 font-semibold">{tx.id}</div>
                      <div className="text-slate-400 truncate max-w-sm">{tx.details || tx.type}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-teal-300">{tx.amount} ECO</div>
                      <span className="text-[10px] text-amber-400 uppercase">Unconfirmed</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
