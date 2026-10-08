import React, { useState, useEffect } from 'react';
import {
  FileCode2,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Coins,
  ArrowRight,
  Clock,
  Sparkles,
  Lock,
  Unlock,
  Package,
  Layers,
  Terminal
} from 'lucide-react';
import { api } from '../api';

export default function SmartContractPage({
  shipments,
  wallets,
  onUpdateStatus,
  onRefresh
}) {
  const [contractInfo, setContractInfo] = useState(null);
  const [selectedShipmentId, setSelectedShipmentId] = useState(shipments?.[0]?.id || 'ECO-SHP-101');
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchContract = async () => {
    try {
      const res = await api.getSmartContractInfo();
      setContractInfo(res);
    } catch (err) {
      console.error('Failed to load contract info:', err);
    }
  };

  useEffect(() => {
    fetchContract();
  }, []);

  const selectedShipment = shipments?.find((s) => s.id === selectedShipmentId);

  const handleSimulateTransition = async (nextState) => {
    setLoading(true);
    setFeedback(null);
    try {
      const res = await onUpdateStatus(selectedShipmentId, nextState);
      setFeedback({
        type: 'success',
        title: 'Smart Contract State Transition Executed',
        message: res.transitionResult.message || `State successfully updated to "${nextState}".`,
        details: res.transitionResult
      });
      fetchContract();
    } catch (err) {
      setFeedback({
        type: 'error',
        title: 'Smart Contract Execution Rejected',
        message: err.message,
        details: null
      });
      fetchContract();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Smart Contract Simulation
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Topic 11
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Autonomous, self-executing code rules for shipping: strictly validates sequential milestones and releases carrier freight payments & sustainability bonuses upon verified delivery.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Total Contract Escrow:</span>
            <span className="px-3 py-1 rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-300 font-mono font-bold text-sm">
              {contractInfo?.escrowBalance || 0} EcoCoins
            </span>
          </div>
        </div>
      </div>

      {/* Contract Rules Cards */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <FileCode2 className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white">
              Contract Specification: EcoShippingContract_v1.0
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400">Autonomous Execution Rules</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {contractInfo?.rules?.map((rule) => (
            <div
              key={rule.id}
              className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1 text-xs"
            >
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-[10px] flex items-center justify-center">
                  {rule.id}
                </span>
                <span>{rule.title}</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed pt-1">
                {rule.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive State Machine Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Tester (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-teal-400" />
              <h3 className="text-base font-bold text-white">Interactive Contract Execution Lab</h3>
            </div>
            <span className="text-xs text-slate-400">Select Shipment to Test</span>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Target Shipment for Contract Execution
              </label>
              <select
                value={selectedShipmentId}
                onChange={(e) => {
                  setSelectedShipmentId(e.target.value);
                  setFeedback(null);
                }}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
              >
                {shipments?.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.id}: {s.title} (Current: {s.status})
                  </option>
                ))}
              </select>
            </div>

            {selectedShipment && (
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Current Status:</span>
                  <span className="px-3 py-1 rounded-full font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs">
                    {selectedShipment.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-500">Escrow Locked:</span>
                    <div className="font-mono text-emerald-400 font-bold">{selectedShipment.escrowAmount} ECO</div>
                  </div>
                  <div>
                    <span className="text-slate-500">Eco Score:</span>
                    <div className="font-bold text-teal-300">{selectedShipment.ecoScore}/100</div>
                  </div>
                  <div>
                    <span className="text-slate-500">Potential Bonus:</span>
                    <div className="font-mono text-amber-300 font-bold">
                      {selectedShipment.ecoScore >= 80 ? '+25 ECO' : '0 ECO'}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons for Testing Valid and Invalid Jumps */}
            <div className="space-y-2 pt-2">
              <div className="text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                Test Allowed State Transitions:
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  disabled={loading || selectedShipment?.status !== 'Pending'}
                  onClick={() => handleSimulateTransition('Picked Up')}
                  className={`px-3.5 py-2 rounded-lg font-bold text-xs transition ${
                    selectedShipment?.status === 'Pending'
                      ? 'bg-blue-600 hover:bg-blue-500 text-white shadow'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  Step 1: Picked Up
                </button>

                <button
                  disabled={loading || selectedShipment?.status !== 'Picked Up'}
                  onClick={() => handleSimulateTransition('In Transit')}
                  className={`px-3.5 py-2 rounded-lg font-bold text-xs transition ${
                    selectedShipment?.status === 'Picked Up'
                      ? 'bg-teal-600 hover:bg-teal-500 text-white shadow'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  Step 2: In Transit
                </button>

                <button
                  disabled={loading || selectedShipment?.status !== 'In Transit'}
                  onClick={() => handleSimulateTransition('Delivered')}
                  className={`px-3.5 py-2 rounded-lg font-bold text-xs transition ${
                    selectedShipment?.status === 'In Transit'
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  Step 3: Delivered (Release Payment)
                </button>
              </div>
            </div>

            {/* Test Illegal Transition / Rejection */}
            <div className="space-y-2 pt-3 border-t border-slate-800">
              <div className="text-slate-400 font-semibold uppercase tracking-wider text-[11px] flex items-center gap-1.5 text-rose-300">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                <span>Test Smart Contract Rejection Rules:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  disabled={loading || selectedShipment?.status === 'Delivered'}
                  onClick={() => handleSimulateTransition('Delivered')}
                  className="px-3 py-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 border border-rose-800 text-xs font-semibold transition"
                  title="Attempt illegal jump to Delivered"
                >
                  Illegal Jump directly to "Delivered"
                </button>
                <button
                  disabled={loading || selectedShipment?.status === 'Pending'}
                  onClick={() => handleSimulateTransition('Pending')}
                  className="px-3 py-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 border border-rose-800 text-xs font-semibold transition"
                  title="Attempt illegal rollback to Pending"
                >
                  Illegal Backward Rollback to "Pending"
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Real-time Feedback & Execution Log (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 flex flex-col">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-base font-bold text-white">Execution Result</h3>
            {feedback && (
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  feedback.type === 'success'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}
              >
                {feedback.type === 'success' ? 'SUCCESS' : 'REJECTED'}
              </span>
            )}
          </div>

          {feedback ? (
            <div
              className={`p-4 rounded-xl border text-xs space-y-2 ${
                feedback.type === 'success'
                  ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-200'
                  : 'bg-rose-950/50 border-rose-500/40 text-rose-200'
              }`}
            >
              <div className="flex items-center gap-2 font-bold">
                {feedback.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-400" />
                )}
                <span>{feedback.title}</span>
              </div>
              <p className="text-[11px] leading-relaxed">{feedback.message}</p>
              {feedback.details?.releasedPayout > 0 && (
                <div className="p-2.5 rounded bg-slate-950 text-emerald-300 font-mono text-[11px] border border-emerald-500/30 mt-2">
                  ✓ Freight Escrow Released: {feedback.details.payoutBreakdown?.freight} ECO<br />
                  ✓ Green Eco-Bonus Minted: +{feedback.details.payoutBreakdown?.ecoBonus} ECO<br />
                  ✓ Total Payout: {feedback.details.releasedPayout} ECO
                </div>
              )}
            </div>
          ) : (
            <div className="p-6 rounded-xl bg-slate-950/50 border border-slate-800/80 text-center text-xs text-slate-500">
              Click any transition button on the left to observe smart contract rule evaluation in real time.
            </div>
          )}

          {/* Audit Logs list */}
          <div className="space-y-2 pt-2 flex-1 overflow-y-auto max-h-72">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Smart Contract Audit Log
            </div>
            {contractInfo?.logs?.slice(0, 6).map((log) => (
              <div
                key={log.id}
                className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 text-[11px] space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`font-semibold ${
                      log.success ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {log.action}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="text-slate-300 text-[10px] truncate">{log.details}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
