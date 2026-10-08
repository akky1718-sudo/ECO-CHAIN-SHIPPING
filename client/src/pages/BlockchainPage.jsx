import React, { useState } from 'react';
import {
  Boxes,
  ShieldCheck,
  ShieldAlert,
  PlusCircle,
  Wrench,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Lock,
  Layers,
  Sparkles,
  RefreshCw,
  Copy,
  Info
} from 'lucide-react';

export default function BlockchainPage({
  blockchain,
  status,
  onRefresh,
  onCreateBlock,
  onTamperBlock,
  onRepairChain
}) {
  const [newBlockData, setNewBlockData] = useState('Port of Antwerp - Zero Emission Cargo Manifest #302');
  const [tamperIndex, setTamperIndex] = useState(1);
  const [tamperedPayload, setTamperedPayload] = useState('TAMPERED: Altered 5,000kg illegal toxic cargo & unauthorized payout');
  const [isCreating, setIsCreating] = useState(false);
  const [isTampering, setIsTampering] = useState(false);
  const [isRepairing, setIsRepairing] = useState(false);
  const [notification, setNotification] = useState(null);
  const [copiedHash, setCopiedHash] = useState(null);

  const chain = blockchain?.chain || [];
  const validation = blockchain?.validation || { isValid: true, status: 'Blockchain Valid', issues: [] };
  const isValid = validation.isValid;

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(text);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const handleCreateBlock = async (e) => {
    e.preventDefault();
    if (!newBlockData.trim()) return;
    setIsCreating(true);
    setNotification(null);
    try {
      await onCreateBlock(newBlockData);
      setNotification({ type: 'success', message: 'New block mined and added to the blockchain!' });
      setNewBlockData('');
    } catch (err) {
      setNotification({ type: 'error', message: err.message || 'Failed to create block' });
    } finally {
      setIsCreating(false);
    }
  };

  const handleTamper = async () => {
    setIsTampering(true);
    setNotification(null);
    try {
      await onTamperBlock(tamperIndex, tamperedPayload);
      setNotification({
        type: 'warning',
        message: `Block #${tamperIndex} tampered! Recalculated hash does not match stored hash. Chain is now INVALID.`
      });
    } catch (err) {
      setNotification({ type: 'error', message: err.message || 'Tampering failed' });
    } finally {
      setIsTampering(false);
    }
  };

  const handleRepair = async () => {
    setIsRepairing(true);
    setNotification(null);
    try {
      await onRepairChain();
      setNotification({
        type: 'success',
        message: 'Blockchain successfully re-mined! Cryptographic linkages restored. Chain is VALID.'
      });
    } catch (err) {
      setNotification({ type: 'error', message: err.message || 'Repair failed' });
    } finally {
      setIsRepairing(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header & Status Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white tracking-tight">Blockchain Visualizer & Ledger</h1>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${
                isValid
                  ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                  : 'bg-rose-950/60 border-rose-500/40 text-rose-300 animate-pulse'
              }`}
            >
              {isValid ? <ShieldCheck className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
              <span>{isValid ? 'Blockchain Valid' : 'Blockchain Invalid (Tampered)'}</span>
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Visualizing cryptographic block linkage: Block 0 (Genesis) → Block 1 → Block 2 ...
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!isValid && (
            <button
              onClick={handleRepair}
              disabled={isRepairing}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg text-xs transition flex items-center gap-1.5 shadow-lg shadow-rose-600/30"
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>{isRepairing ? 'Re-Mining Chain...' : 'Repair / Re-Mine Chain'}</span>
            </button>
          )}

          <button
            onClick={onRefresh}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Validate Now</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {notification && (
        <div
          className={`p-4 rounded-xl border text-sm flex items-center justify-between ${
            notification.type === 'success'
              ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
              : notification.type === 'warning'
              ? 'bg-amber-950/60 border-amber-500/40 text-amber-300'
              : 'bg-rose-950/60 border-rose-500/40 text-rose-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
          <button onClick={() => setNotification(null)} className="opacity-70 hover:opacity-100 text-xs font-bold">
            Dismiss
          </button>
        </div>
      )}

      {/* Validation Issue Breakdown Alert if Invalid */}
      {!isValid && validation.issues && validation.issues.length > 0 && (
        <div className="bg-rose-950/40 border border-rose-600/50 rounded-xl p-5 space-y-2">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
            <AlertTriangle className="w-4 h-4" />
            <span>Cryptographic Integrity Violation Detected:</span>
          </div>
          <ul className="list-disc list-inside text-xs text-rose-200/90 space-y-1 pl-1">
            {validation.issues.map((iss, i) => (
              <li key={i}>
                <span className="font-semibold">{iss.type}:</span> {iss.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Concept 1 & 4: Visual Blockchain Diagram */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Boxes className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white">Visual Blockchain (Ordered Block Chain)</h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Chain Length: {chain.length} Blocks · Difficulty: {blockchain?.difficulty || 2}
          </span>
        </div>

        {/* Chain Ribbon */}
        <div className="flex flex-col gap-6">
          {chain.map((block, idx) => {
            const isGenesis = block.index === 0;
            const isCorrupted = validation.issues?.some((i) => i.blockIndex === block.index);
            const isLinkedToCorrupted = validation.issues?.some((i) => i.blockIndex === block.index + 1);

            return (
              <div key={block.index} className="relative">
                {/* Visual Connector Line from previous block */}
                {idx > 0 && (
                  <div className="flex items-center justify-center -my-3 relative z-10">
                    <div
                      className={`flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono border backdrop-blur ${
                        isLinkedToCorrupted
                          ? 'bg-rose-950 border-rose-500 text-rose-300'
                          : 'bg-slate-900 border-slate-700 text-slate-400'
                      }`}
                    >
                      <span>previousHash =</span>
                      <span className="text-emerald-400 truncate max-w-[150px]">
                        {block.previousHash.slice(0, 16)}...
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                      <span>matches Block #{idx - 1}</span>
                    </div>
                  </div>
                )}

                {/* Block Card */}
                <div
                  className={`rounded-2xl border p-6 transition-all shadow-xl ${
                    isCorrupted
                      ? 'bg-rose-950/30 border-rose-600/70 shadow-rose-950/50'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Top Bar of Block */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono font-bold text-base shadow ${
                          isGenesis
                            ? 'bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950'
                            : isCorrupted
                            ? 'bg-rose-600 text-white'
                            : 'bg-gradient-to-tr from-emerald-600 to-teal-400 text-slate-950'
                        }`}
                      >
                        #{block.index}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-white">
                            {isGenesis ? 'Genesis Block (Block 0)' : `Block #${block.index}`}
                          </h3>
                          {isCorrupted && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                              TAMPERED!
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400">
                          Timestamp: {new Date(block.timestamp).toLocaleString()} ({block.timestamp})
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 font-mono text-xs">
                      <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                        Nonce: <strong className="text-emerald-400">{block.nonce}</strong>
                      </span>
                      <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                        PoW Attempts: <strong className="text-teal-400">{block.attempts || 1}</strong>
                      </span>
                      {block.miningDurationMs > 0 && (
                        <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-400 border border-slate-700">
                          {block.miningDurationMs}ms
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Block Body: Hashes & Data */}
                  <div className="mt-4 space-y-3 text-xs">
                    {/* Previous Hash */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center p-2.5 rounded-lg bg-slate-950/70 border border-slate-800">
                      <span className="md:col-span-3 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                        Previous Hash
                      </span>
                      <div className="md:col-span-9 font-mono text-slate-300 truncate flex items-center justify-between">
                        <span className={isGenesis ? 'text-amber-400 font-bold' : 'text-slate-300'}>
                          {block.previousHash}
                        </span>
                        <button
                          onClick={() => copyToClipboard(block.previousHash)}
                          className="ml-2 text-slate-500 hover:text-white"
                          title="Copy hash"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Current Block Hash */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center p-2.5 rounded-lg bg-slate-950/70 border border-slate-800">
                      <span className="md:col-span-3 text-emerald-400 font-semibold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5" />
                        Current Hash (SHA-256)
                      </span>
                      <div className="md:col-span-9 font-mono truncate flex items-center justify-between">
                        <span className="text-emerald-400 font-bold">
                          {block.hash}
                        </span>
                        <button
                          onClick={() => copyToClipboard(block.hash)}
                          className="ml-2 text-slate-500 hover:text-white"
                          title="Copy hash"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Merkle Root */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center p-2.5 rounded-lg bg-slate-950/70 border border-slate-800">
                      <span className="md:col-span-3 text-purple-400 font-semibold uppercase tracking-wider text-[11px]">
                        Merkle Root
                      </span>
                      <div className="md:col-span-9 font-mono text-purple-300 truncate">
                        {block.merkleRoot || 'N/A'}
                      </div>
                    </div>

                    {/* Block Payload / Data */}
                    <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                      <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        Block Data Payload & Cargo Records
                      </div>
                      <div className="text-slate-200 font-medium whitespace-pre-wrap">
                        {typeof block.data === 'string' ? block.data : JSON.stringify(block.data, null, 2)}
                      </div>
                      {block.transactions && block.transactions.length > 0 && (
                        <div className="pt-2 text-[11px] text-teal-400 font-mono">
                          Contains {block.transactions.length} verified transaction(s)
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Interactive Labs: 1. Create Block dynamically & 2. Tamper Lab */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
        {/* Lab 1: Dynamic Block Creation */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-lg">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">Dynamic Block Creator</h3>
          </div>
          <p className="text-xs text-slate-400">
            Topic 1 & 3: Instantiate a new Block class object with custom shipping data, calculate its hash, and append it to the chain.
          </p>

          <form onSubmit={handleCreateBlock} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Block Cargo / Manifest Data
              </label>
              <textarea
                rows="3"
                value={newBlockData}
                onChange={(e) => setNewBlockData(e.target.value)}
                placeholder="Enter maritime manifest cargo data..."
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={isCreating}
              className="w-full py-2.5 px-4 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{isCreating ? 'Mining & Adding Block...' : 'Create & Add Block'}</span>
            </button>
          </form>
        </div>

        {/* Lab 2: Tamper Demonstration Tool */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-lg">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">Blockchain Tamper Lab</h3>
          </div>
          <p className="text-xs text-slate-400">
            Topic 5: Modify data inside an existing block without re-mining. Observe how hash recalculation detects fraud and invalidates the chain.
          </p>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Select Block to Tamper
              </label>
              <select
                value={tamperIndex}
                onChange={(e) => setTamperIndex(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                {chain.map((b) => (
                  <option key={b.index} value={b.index}>
                    Block #{b.index} {b.index === 0 ? '(Genesis)' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Tampered Malicious Payload
              </label>
              <input
                type="text"
                value={tamperedPayload}
                onChange={(e) => setTamperedPayload(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={handleTamper}
                disabled={isTampering}
                className="flex-1 py-2.5 px-4 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>{isTampering ? 'Tampering...' : 'Tamper Block Data'}</span>
              </button>

              <button
                onClick={handleRepair}
                disabled={isRepairing}
                className="py-2.5 px-4 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700 transition"
                title="Restore validity by re-mining"
              >
                Re-Mine / Repair
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
