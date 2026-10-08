import React, { useState, useEffect } from 'react';
import {
  ArrowLeftRight,
  Send,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Layers,
  ShieldCheck,
  Coins,
  Copy,
  Sparkles
} from 'lucide-react';
import { api } from '../api';

export default function TransactionsPage({
  transactions,
  wallets,
  onCreateTransaction,
  onRefresh
}) {
  const [formData, setFormData] = useState({
    sender: wallets?.[3]?.address || '',
    receiver: wallets?.[4]?.address || '',
    amount: 100,
    details: 'Eco-Packaging procurement settlement'
  });

  const [validationResult, setValidationResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  // Automatically dry-run validate transaction whenever form changes
  useEffect(() => {
    if (!formData.sender || !formData.receiver) return;

    let isMounted = true;
    api.validateTransactionDryRun(formData)
      .then((res) => {
        if (isMounted) setValidationResult(res);
      })
      .catch((err) => {
        console.error('Validation error:', err);
      });

    return () => {
      isMounted = false;
    };
  }, [formData.sender, formData.receiver, formData.amount]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage(null);
    try {
      const res = await onCreateTransaction(formData);
      setStatusMessage({
        type: 'success',
        text: `Transaction ${res.transaction.id} passed all 5 validation rules and is queued in the Mempool!`
      });
      setFormData({
        ...formData,
        amount: 50,
        details: 'Shipping invoice payment'
      });
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: err.message || 'Transaction validation failed'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const senderWallet = wallets?.find((w) => w.address === formData.sender);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white tracking-tight">EcoCoin Transactions & Validator</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Topics 8 & 9
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Create peer-to-peer value transfers. Every transaction is verified against 5 cryptographic and business rules before entering the pending mempool.
            </p>
          </div>
        </div>
      </div>

      {statusMessage && (
        <div
          className={`p-4 rounded-xl border text-sm flex items-center justify-between ${
            statusMessage.type === 'success'
              ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
              : 'bg-rose-950/60 border-rose-500/40 text-rose-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
          <button onClick={() => setStatusMessage(null)} className="text-xs font-bold opacity-70 hover:opacity-100">
            Dismiss
          </button>
        </div>
      )}

      {/* Main Grid: Transaction Creation Form & Real-time Rule Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <Send className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white">Initiate EcoCoin Transfer</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Sender Selection */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-300 font-semibold">Sender Wallet</label>
                {senderWallet && (
                  <span className="text-emerald-400 font-mono">
                    Balance: {senderWallet.balance} ECO
                  </span>
                )}
              </div>
              <select
                value={formData.sender}
                onChange={(e) => setFormData({ ...formData, sender: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
              >
                {wallets?.map((w) => (
                  <option key={w.id} value={w.address}>
                    {w.name} ({w.role}) - {w.balance} ECO
                  </option>
                ))}
              </select>
            </div>

            {/* Receiver Selection */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Receiver Wallet</label>
              <select
                value={formData.receiver}
                onChange={(e) => setFormData({ ...formData, receiver: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
              >
                {wallets?.map((w) => (
                  <option key={w.id} value={w.address}>
                    {w.name} ({w.role}) - {w.balance} ECO
                  </option>
                ))}
              </select>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Transfer Amount (EcoCoins)</label>
              <input
                type="number"
                min="1"
                required
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            {/* Memo / Details */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Invoice / Memo Details</label>
              <input
                type="text"
                value={formData.details}
                onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || (validationResult && !validationResult.isValid)}
              className={`w-full py-3 px-4 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 ${
                validationResult?.isValid
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Validating & Submitting...' : 'Validate & Queue Transaction'}</span>
            </button>
          </form>
        </div>

        {/* Right Column: Live Topic 9 Validation Inspector (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-teal-400" />
              <h3 className="text-base font-bold text-white">Topic 9 Validator</h3>
            </div>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                validationResult?.isValid
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              }`}
            >
              {validationResult?.isValid ? 'ALL RULES PASS' : 'RULE VIOLATION'}
            </span>
          </div>

          <p className="text-xs text-slate-400">
            Real-time checks evaluated on the transaction before network acceptance:
          </p>

          {/* Checklist */}
          <div className="space-y-2.5">
            {validationResult?.checklist?.map((item, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg border text-xs flex items-start gap-3 transition ${
                  item.passed
                    ? 'bg-emerald-950/30 border-emerald-500/30 text-slate-200'
                    : 'bg-rose-950/30 border-rose-500/30 text-rose-200'
                }`}
              >
                {item.passed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                )}
                <div className="space-y-0.5">
                  <div className="font-semibold text-white">{item.rule}</div>
                  <div className="text-[11px] text-slate-400">{item.details}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
            {validationResult?.message}
          </div>
        </div>
      </div>

      {/* Tables: Pending Mempool & Confirmed Ledger */}
      <div className="space-y-6 pt-2">
        {/* Pending Transactions Mempool */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-white">Pending Transactions Pool (Mempool)</h3>
            </div>
            <span className="text-xs font-mono text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              {transactions?.pending?.length || 0} Awaiting Block Mining
            </span>
          </div>

          {(!transactions?.pending || transactions.pending.length === 0) ? (
            <div className="text-center py-6 text-slate-500 text-xs">
              No pending transactions currently in mempool.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                    <th className="pb-2">TX ID</th>
                    <th className="pb-2">Sender</th>
                    <th className="pb-2">Receiver</th>
                    <th className="pb-2">Amount</th>
                    <th className="pb-2">Details</th>
                    <th className="pb-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {transactions.pending.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-800/40">
                      <td className="py-2.5 text-emerald-400">{tx.id}</td>
                      <td className="py-2.5 text-slate-400 truncate max-w-[120px]">{tx.sender}</td>
                      <td className="py-2.5 text-slate-400 truncate max-w-[120px]">{tx.receiver}</td>
                      <td className="py-2.5 text-white font-bold">{tx.amount} ECO</td>
                      <td className="py-2.5 font-sans text-slate-300">{tx.details || tx.type}</td>
                      <td className="py-2.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-sans font-semibold bg-amber-500/20 text-amber-300">
                          PENDING
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Confirmed Transactions Ledger */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white">Confirmed Transactions on Blockchain</h3>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              {transactions?.confirmed?.length || 0} Confirmed
            </span>
          </div>

          {(!transactions?.confirmed || transactions.confirmed.length === 0) ? (
            <div className="text-center py-6 text-slate-500 text-xs">
              No confirmed transactions yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                    <th className="pb-2">TX ID</th>
                    <th className="pb-2">Block #</th>
                    <th className="pb-2">Sender</th>
                    <th className="pb-2">Receiver</th>
                    <th className="pb-2">Amount</th>
                    <th className="pb-2">Type</th>
                    <th className="pb-2">Simulated Signature</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {transactions.confirmed.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-800/40">
                      <td className="py-2.5 text-emerald-400 font-semibold">{tx.id}</td>
                      <td className="py-2.5 text-teal-300">Block #{tx.blockIndex}</td>
                      <td className="py-2.5 text-slate-400 truncate max-w-[110px]">{tx.sender}</td>
                      <td className="py-2.5 text-slate-400 truncate max-w-[110px]">{tx.receiver}</td>
                      <td className="py-2.5 text-white font-bold">{tx.amount} ECO</td>
                      <td className="py-2.5 font-sans text-slate-300">{tx.type}</td>
                      <td className="py-2.5 text-slate-400 text-[10px] truncate max-w-[120px]">
                        {tx.signature}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
