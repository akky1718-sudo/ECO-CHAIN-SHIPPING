import React, { useState } from 'react';
import {
  Compass,
  Search,
  Boxes,
  ArrowLeftRight,
  Clock,
  Lock,
  Copy,
  CheckCircle2,
  X,
  Eye,
  FileCode,
  Layers,
  Sparkles
} from 'lucide-react';
import { api } from '../api';

export default function ExplorerPage({ blockchain, transactions, onNavigate }) {
  const chain = blockchain?.chain || [];
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [copiedText, setCopiedText] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const res = await api.searchExplorer(searchQuery.trim());
      setSearchResults(res.results);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white tracking-tight">Mini Blockchain Explorer</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Topic 12
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Inspect immutable ledger data: search blocks by index or hash, and look up individual transaction receipts.
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Block Index (e.g. 1), Block Hash (00...), Transaction ID (TX-...), or Shipment ID (ECO-SHP-101)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
          <button
            type="submit"
            disabled={isSearching}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition shadow-lg shadow-emerald-500/20 shrink-0"
          >
            {isSearching ? 'Searching...' : 'Search Ledger'}
          </button>
        </form>
      </div>

      {/* Search Results Display */}
      {searchResults !== null && (
        <div className="bg-slate-900 border border-teal-500/30 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5 text-teal-400" />
              <h3 className="text-base font-bold text-white">
                Search Results ({searchResults.length} match{searchResults.length === 1 ? '' : 'es'})
              </h3>
            </div>
            <button
              onClick={() => {
                setSearchResults(null);
                setSearchQuery('');
              }}
              className="text-xs text-slate-400 hover:text-white"
            >
              Clear Search
            </button>
          </div>

          {searchResults.length === 0 ? (
            <div className="text-center py-6 text-slate-500 text-xs">
              No blocks, transactions, or shipments found matching "{searchQuery}".
            </div>
          ) : (
            <div className="space-y-3">
              {searchResults.map((res, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2 hover:border-slate-700 transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-400 text-sm">{res.title}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-teal-300">
                      {res.type}
                    </span>
                  </div>

                  {res.type === 'BLOCK' && (
                    <div className="font-mono text-[11px] space-y-1 text-slate-300">
                      <div>Hash: <span className="text-emerald-400">{res.data.hash}</span></div>
                      <div>Previous Hash: <span className="text-slate-400">{res.data.previousHash}</span></div>
                      <div>Transactions: {res.data.transactions?.length || 0}</div>
                      <button
                        onClick={() => setSelectedBlock(res.data)}
                        className="mt-2 text-xs font-semibold text-teal-400 hover:text-teal-300 flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect Full Block</span>
                      </button>
                    </div>
                  )}

                  {res.type.includes('TRANSACTION') && (
                    <div className="font-mono text-[11px] space-y-1 text-slate-300">
                      <div>Sender: {res.data.sender}</div>
                      <div>Receiver: {res.data.receiver}</div>
                      <div>Amount: <strong className="text-emerald-400">{res.data.amount} ECO</strong></div>
                      <div>Signature: <span className="text-slate-500">{res.data.signature}</span></div>
                    </div>
                  )}

                  {res.type === 'SHIPMENT' && (
                    <div className="text-[11px] space-y-1 text-slate-300">
                      <div>Status: <span className="text-emerald-400 font-bold">{res.data.status}</span></div>
                      <div>Route: {res.data.origin} → {res.data.destination}</div>
                      <div>Escrow: {res.data.escrowAmount} ECO</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Blocks Explorer Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Boxes className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white">All Mined Blocks</h2>
          </div>
          <span className="text-xs font-mono text-slate-400">Total: {chain.length} Blocks</span>
        </div>

        <div className="space-y-3">
          {chain.map((block) => (
            <div
              key={block.index}
              className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
            >
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm text-emerald-400">
                    Block #{block.index}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {new Date(block.timestamp).toLocaleString()}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800 font-mono">
                    Nonce: {block.nonce}
                  </span>
                </div>

                <div className="font-mono text-[11px] text-slate-400 truncate">
                  Hash: <span className="text-teal-300">{block.hash}</span>
                </div>

                <div className="font-mono text-[10px] text-slate-500 truncate">
                  Prev: {block.previousHash}
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="font-mono text-[11px] px-2.5 py-1 rounded-lg bg-slate-900 text-emerald-400 border border-slate-800">
                  {block.transactions?.length || 0} Tx(s)
                </span>

                <button
                  onClick={() => setSelectedBlock(block)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5 text-teal-400" />
                  <span>Inspect</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Block Inspector Modal */}
      {selectedBlock && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Boxes className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">
                  Block #{selectedBlock.index} Full Inspection
                </h3>
              </div>
              <button
                onClick={() => setSelectedBlock(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 font-semibold">Block Index</span>
                  <div className="font-mono text-emerald-400 font-bold text-base mt-0.5">
                    #{selectedBlock.index}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 font-semibold">Winning Nonce</span>
                  <div className="font-mono text-teal-300 font-bold text-base mt-0.5">
                    {selectedBlock.nonce}
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-400 font-semibold">SHA-256 Block Hash</span>
                <div className="font-mono text-[11px] text-emerald-400 break-all">
                  {selectedBlock.hash}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-400 font-semibold">Previous Hash Link</span>
                <div className="font-mono text-[11px] text-slate-300 break-all">
                  {selectedBlock.previousHash}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-400 font-semibold">Merkle Root</span>
                <div className="font-mono text-[11px] text-purple-300 break-all">
                  {selectedBlock.merkleRoot}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-400 font-semibold">Block Data / Manifest</span>
                <div className="text-slate-200 whitespace-pre-wrap">
                  {typeof selectedBlock.data === 'string'
                    ? selectedBlock.data
                    : JSON.stringify(selectedBlock.data, null, 2)}
                </div>
              </div>

              {/* Transactions inside this block */}
              <div className="space-y-2 pt-2">
                <span className="text-slate-300 font-semibold uppercase tracking-wider text-[11px]">
                  Transactions in this Block ({selectedBlock.transactions?.length || 0})
                </span>

                {(!selectedBlock.transactions || selectedBlock.transactions.length === 0) ? (
                  <div className="text-slate-500 text-[11px] italic">No transaction records in this block.</div>
                ) : (
                  <div className="space-y-2">
                    {selectedBlock.transactions.map((tx) => (
                      <div
                        key={tx.id}
                        className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-[11px] space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-emerald-400 font-bold">{tx.id}</span>
                          <span className="font-mono font-bold text-white">{tx.amount} ECO</span>
                        </div>
                        <div className="text-slate-400 text-[10px] truncate">
                          From: {tx.sender} → To: {tx.receiver}
                        </div>
                        <div className="font-mono text-[10px] text-slate-500 truncate">
                          Signature: {tx.signature}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-800">
              <button
                onClick={() => setSelectedBlock(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
