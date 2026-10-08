import React from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  RotateCcw, 
  Boxes, 
  Layers, 
  Presentation, 
  CheckCircle2, 
  AlertTriangle,
  Leaf
} from 'lucide-react';

export default function Navbar({ 
  status, 
  onReset, 
  onNavigate, 
  activeTab,
  onQuickRepair 
}) {
  const isValid = status?.isChainValid ?? true;
  const pendingCount = status?.pendingTransactionsCount ?? 0;
  const blockCount = status?.totalBlocks ?? 0;

  return (
    <header className="h-16 bg-slate-900/90 backdrop-blur border-b border-slate-800 px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-emerald-500/20">
          <Leaf className="w-6 h-6 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-lg text-white tracking-tight">Eco Chain Shipping</h1>
            <span className="text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Blockchain v1.0
            </span>
          </div>
          <p className="text-xs text-slate-400">Sustainable Logistics & Maritime Ledger</p>
        </div>
      </div>

      {/* Center / Status KPIs */}
      <div className="hidden md:flex items-center gap-3">
        {/* Blockchain Status Indicator */}
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
            isValid
              ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
              : 'bg-rose-950/60 border-rose-700 text-rose-300 animate-pulse'
          }`}
        >
          {isValid ? (
            <>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Blockchain Valid</span>
            </>
          ) : (
            <>
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>Chain Invalid (Tampered)</span>
              {onQuickRepair && (
                <button
                  onClick={onQuickRepair}
                  className="ml-2 px-2 py-0.5 bg-rose-600 hover:bg-rose-500 text-white rounded text-[11px] font-semibold transition"
                  title="Re-mine to fix chain"
                >
                  Repair Chain
                </button>
              )}
            </>
          )}
        </div>

        {/* Height badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300">
          <Boxes className="w-3.5 h-3.5 text-teal-400" />
          <span>Height:</span>
          <span className="font-mono font-semibold text-emerald-400">{blockCount} Blocks</span>
        </div>

        {/* Pending pool badge */}
        <div 
          onClick={() => onNavigate('transactions')}
          className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-xs text-slate-300 transition"
          title="View Pending Transactions"
        >
          <Layers className="w-3.5 h-3.5 text-amber-400" />
          <span>Mempool:</span>
          <span className={`font-mono font-semibold ${pendingCount > 0 ? 'text-amber-400' : 'text-slate-400'}`}>
            {pendingCount} Pending
          </span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => onNavigate('demo')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition shadow-sm ${
            activeTab === 'demo'
              ? 'bg-emerald-500 text-slate-950 font-bold'
              : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
          }`}
        >
          <Presentation className="w-4 h-4" />
          <span>Faculty Demo Tour</span>
        </button>

        <button
          onClick={onReset}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-medium transition"
          title="Reset to pristine initial seed state"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden sm:inline">Reset System</span>
        </button>
      </div>
    </header>
  );
}
