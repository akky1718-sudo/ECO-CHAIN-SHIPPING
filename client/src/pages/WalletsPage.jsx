import React, { useState } from 'react';
import {
  Wallet,
  PlusCircle,
  Copy,
  CheckCircle2,
  Key,
  Shield,
  Coins,
  Building,
  Truck,
  Anchor,
  X,
  Sparkles
} from 'lucide-react';

export default function WalletsPage({ wallets, onCreateWallet, onRefresh }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedKey, setCopiedKey] = useState(null);
  const [newWalletData, setNewWalletData] = useState({
    name: 'Nordic Clean Maritime Ltd',
    role: 'CARRIER',
    balance: 2500
  });
  const [message, setMessage] = useState(null);

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await onCreateWallet(newWalletData);
      setIsModalOpen(false);
      setMessage(`New demo wallet "${newWalletData.name}" created successfully!`);
    } catch (err) {
      alert(err.message || 'Error creating wallet');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Wallets & Simulated Keys</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Topic 7
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Simulated public key cryptography. Public addresses identify shipping participants; simulated private keys sign transactions.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-sm transition shadow-lg shadow-emerald-500/20 shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create Demo Wallet</span>
        </button>
      </div>

      {message && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{message}</span>
          </div>
          <button onClick={() => setMessage(null)} className="text-xs font-bold opacity-70 hover:opacity-100">
            Dismiss
          </button>
        </div>
      )}

      {/* Academic Safety Notice Banner */}
      <div className="bg-slate-900/60 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3 text-xs text-amber-200/90">
        <Shield className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-amber-300 font-semibold">Academic Simulation Safety Notice: </strong>
          All private keys, public addresses, and EcoCoins in this system are purely simulated for educational and 
          college demonstration purposes. No real cryptocurrency, real financial funds, or external networks are involved.
        </div>
      </div>

      {/* Wallets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {wallets?.map((w) => (
          <div
            key={w.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition shadow-lg space-y-4"
          >
            {/* Top row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                  {w.role === 'CARRIER' ? <Truck className="w-5 h-5" /> : <Building className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">{w.name}</h3>
                  <span className="font-mono text-[11px] text-slate-400">{w.id}</span>
                </div>
              </div>

              <span
                className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                  w.role === 'ADMIN'
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    : w.role === 'CARRIER'
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    : w.role === 'SHIPPER'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                }`}
              >
                {w.role}
              </span>
            </div>

            {/* Balance */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Coins className="w-4 h-4 text-emerald-400" />
                <span>Simulated Balance:</span>
              </div>
              <div className="font-mono font-bold text-xl text-emerald-400">
                {w.balance.toLocaleString()} <span className="text-xs font-sans text-slate-400">EcoCoins</span>
              </div>
            </div>

            {/* Public Address */}
            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span className="font-semibold text-[11px] uppercase tracking-wider">Public Key Address</span>
                {copiedKey === w.address ? (
                  <span className="text-emerald-400 text-[10px] flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="w-3 h-3" /> Copied!
                  </span>
                ) : (
                  <button
                    onClick={() => copyToClipboard(w.address, w.address)}
                    className="hover:text-white flex items-center gap-1 text-[11px]"
                  >
                    <Copy className="w-3 h-3" /> Copy
                  </button>
                )}
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 font-mono text-[11px] text-teal-300 break-all">
                {w.address}
              </div>
            </div>

            {/* Private Key Representation */}
            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span className="font-semibold text-[11px] uppercase tracking-wider flex items-center gap-1">
                  <Key className="w-3 h-3 text-amber-400" />
                  Simulated Private Key (Demo Representation)
                </span>
                {copiedKey === w.privateKey ? (
                  <span className="text-emerald-400 text-[10px] flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="w-3 h-3" /> Copied!
                  </span>
                ) : (
                  <button
                    onClick={() => copyToClipboard(w.privateKey, w.privateKey)}
                    className="hover:text-white flex items-center gap-1 text-[11px]"
                  >
                    <Copy className="w-3 h-3" /> Copy
                  </button>
                )}
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950/80 border border-amber-900/40 font-mono text-[11px] text-amber-300/90 break-all">
                {w.privateKey}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Create Demo Wallet */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Create New Demo Wallet</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Entity / Company Name</label>
                <input
                  type="text"
                  required
                  value={newWalletData.name}
                  onChange={(e) => setNewWalletData({ ...newWalletData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Participant Role</label>
                <select
                  value={newWalletData.role}
                  onChange={(e) => setNewWalletData({ ...newWalletData, role: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="SHIPPER">SHIPPER (Cargo Owner)</option>
                  <option value="CARRIER">CARRIER (Freight Operator)</option>
                  <option value="RECEIVER">RECEIVER (Consignee)</option>
                  <option value="REGULATOR">REGULATOR (Port Customs Authority)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Initial Demo Grant (EcoCoins)</label>
                <input
                  type="number"
                  min="0"
                  value={newWalletData.balance}
                  onChange={(e) => setNewWalletData({ ...newWalletData, balance: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold"
                >
                  Generate Wallet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
