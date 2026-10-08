import React, { useState, useEffect } from 'react';
import {
  GitFork,
  CheckCircle2,
  Boxes,
  Copy,
  Layers,
  Sparkles,
  ArrowDown,
  ArrowUp,
  RefreshCw,
  Hash,
  AlertCircle
} from 'lucide-react';
import { api } from '../api';

export default function MerkleTreePage({ blockchain }) {
  const chain = blockchain?.chain || [];
  const [selectedBlockIndex, setSelectedBlockIndex] = useState(1);
  const [useCustomItems, setUseCustomItems] = useState(false);
  const [customInputs, setCustomInputs] = useState([
    'Tx 1: 220 ECO Escrow Lock (Shipment 101)',
    'Tx 2: 245 ECO Delivery Release to Carrier',
    'Tx 3: 380 ECO Escrow Lock (Shipment 102)'
  ]);
  const [treeData, setTreeData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copiedText, setCopiedText] = useState(null);

  const fetchTree = async () => {
    setLoading(true);
    try {
      if (useCustomItems) {
        const res = await api.generateMerkleTree(customInputs.filter((i) => i.trim() !== ''));
        setTreeData({
          root: res.root,
          levels: res.levels,
          leafCount: res.leafCount,
          isBlock: false
        });
      } else {
        const res = await api.getBlockMerkleTree(selectedBlockIndex);
        setTreeData({
          root: res.storedMerkleRoot,
          levels: res.computedTree.levels,
          leafCount: res.computedTree.leafCount,
          blockIndex: res.blockIndex,
          matches: res.matches,
          isBlock: true
        });
      }
    } catch (err) {
      console.error('Error fetching Merkle Tree:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTree();
  }, [selectedBlockIndex, useCustomItems]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleAddCustomLeaf = () => {
    setCustomInputs([...customInputs, `Tx ${customInputs.length + 1}: ${Math.floor(50 + Math.random() * 200)} ECO Carbon Offset`]);
  };

  const handleRemoveCustomLeaf = (idx) => {
    if (customInputs.length <= 1) return;
    const next = [...customInputs];
    next.splice(idx, 1);
    setCustomInputs(next);
  };

  const handleCustomChange = (idx, val) => {
    const next = [...customInputs];
    next[idx] = val;
    setCustomInputs(next);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white tracking-tight">Merkle Tree Visualizer</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Topic 10
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Hierarchical binary cryptographic tree. Computes pairwise SHA-256 hashes upwards until producing a single, tamper-evident <strong>Merkle Root</strong>.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setUseCustomItems(false);
                fetchTree();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                !useCustomItems
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Block Transactions
            </button>
            <button
              onClick={() => {
                setUseCustomItems(true);
                fetchTree();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                useCustomItems
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Custom Tree Sandbox
            </button>
          </div>
        </div>
      </div>

      {/* Control Strip */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
        {!useCustomItems ? (
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-300">Select Block to Inspect:</span>
            <select
              value={selectedBlockIndex}
              onChange={(e) => setSelectedBlockIndex(Number(e.target.value))}
              className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              {chain.map((b) => (
                <option key={b.index} value={b.index}>
                  Block #{b.index} ({b.transactions?.length || 1} items)
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleAddCustomLeaf}
              className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold transition"
            >
              + Add Transaction Leaf
            </button>
            <button
              onClick={() => {
                setCustomInputs(['Tx A: 100 ECO', 'Tx B: 200 ECO', 'Tx C: 300 ECO']);
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700"
            >
              Load 3 Items (Odd Count Demo)
            </button>
            <button
              onClick={() => {
                setCustomInputs(['Tx A: 100 ECO', 'Tx B: 200 ECO', 'Tx C: 300 ECO', 'Tx D: 400 ECO']);
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700"
            >
              Load 4 Items (Even Count)
            </button>
            <button
              onClick={fetchTree}
              className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition ml-2"
            >
              Recompute Tree
            </button>
          </div>
        )}

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">Total Leaves:</span>
          <span className="font-mono text-emerald-400 font-bold">{treeData?.leafCount || 0}</span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-400">Hierarchy Depth:</span>
          <span className="font-mono text-teal-300 font-bold">{treeData?.levels?.length || 0} Levels</span>
        </div>
      </div>

      {/* Custom Inputs Editor if in Custom Mode */}
      {useCustomItems && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="text-xs font-bold text-white uppercase tracking-wider">
            Edit Leaf Transactions (Instant Re-calculation)
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {customInputs.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleCustomChange(idx, e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                />
                <button
                  onClick={() => handleRemoveCustomLeaf(idx)}
                  className="text-slate-500 hover:text-rose-400 text-xs font-bold px-2 py-1"
                  title="Remove leaf"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Merkle Root Highlight Card */}
      {treeData?.root && (
        <div className="bg-gradient-to-r from-purple-950/40 via-slate-900 to-slate-900 border border-purple-500/40 rounded-2xl p-6 shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              Final Calculated Merkle Root (Top of Tree)
            </span>
            <button
              onClick={() => copyToClipboard(treeData.root)}
              className="text-xs text-purple-300 hover:text-white flex items-center gap-1 font-mono"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copiedText === treeData.root ? 'Copied!' : 'Copy Root'}</span>
            </button>
          </div>
          <div className="font-mono text-sm md:text-base font-bold text-white break-all bg-slate-950/80 p-3 rounded-xl border border-purple-900/50">
            {treeData.root}
          </div>
          <p className="text-[11px] text-slate-400">
            This 64-character hash summarizes all transactions in the block. Changing even 1 character in any transaction below cascades upward and alters this root.
          </p>
        </div>
      )}

      {/* Visual Tree Levels Diagram */}
      {treeData?.levels && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-8">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <GitFork className="w-5 h-5 text-teal-400" />
              <h2 className="text-base font-bold text-white">Visual Merkle Hierarchy (Top → Down)</h2>
            </div>
            <span className="text-xs text-slate-400">
              Odd leaf duplication rule applied when count is odd
            </span>
          </div>

          {/* Render levels in reverse (from Root at top to Leaves at bottom) */}
          <div className="space-y-8">
            {[...treeData.levels].reverse().map((levelNodes, revIdx) => {
              const actualLevelIndex = treeData.levels.length - 1 - revIdx;
              const isRootLevel = actualLevelIndex === treeData.levels.length - 1;
              const isLeafLevel = actualLevelIndex === 0;

              return (
                <div key={actualLevelIndex} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                      <Layers className="w-3.5 h-3.5 text-emerald-400" />
                      {isRootLevel
                        ? 'Level Top: Merkle Root'
                        : isLeafLevel
                        ? 'Level 0: Leaf Transactions'
                        : `Level ${actualLevelIndex}: Intermediate Combined Hashes`}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {levelNodes.length} node(s)
                    </span>
                  </div>

                  {/* Nodes in this level */}
                  <div className="flex flex-wrap items-center justify-center gap-4">
                    {levelNodes.map((node) => (
                      <div
                        key={node.id}
                        className={`p-4 rounded-xl border text-xs transition-all max-w-xs w-full shadow-lg ${
                          isRootLevel
                            ? 'bg-purple-950/40 border-purple-500/60 text-white'
                            : isLeafLevel
                            ? 'bg-slate-950/70 border-emerald-500/40 text-slate-200'
                            : 'bg-slate-950/50 border-teal-500/40 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 font-semibold">
                            {node.id}
                          </span>
                          {node.isDuplicated && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold uppercase">
                              Odd Dup
                            </span>
                          )}
                        </div>

                        <div className="font-semibold text-white truncate mb-1">
                          {node.label}
                        </div>

                        <div className="font-mono text-[10px] text-emerald-400 break-all bg-slate-900/90 p-2 rounded border border-slate-800/80">
                          {node.hash}
                        </div>

                        {node.leftChildId && (
                          <div className="mt-2 pt-2 border-t border-slate-800 text-[10px] text-slate-400 font-mono flex items-center justify-between">
                            <span>Left: {node.leftChildId}</span>
                            <span>Right: {node.rightChildId}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Flow Arrow down to next level */}
                  {!isLeafLevel && (
                    <div className="flex justify-center text-slate-600">
                      <ArrowDown className="w-5 h-5 text-teal-500/50 animate-bounce" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
