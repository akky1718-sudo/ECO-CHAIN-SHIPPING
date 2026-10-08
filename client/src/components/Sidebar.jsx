import React from 'react';
import {
  LayoutDashboard,
  Package,
  Boxes,
  Cpu,
  Wallet,
  ArrowLeftRight,
  GitFork,
  FileCode2,
  Compass,
  Hash,
  Presentation,
  BookOpen,
  Info
} from 'lucide-react';

export default function Sidebar({ activeTab, onSelectTab, status }) {
  const pendingCount = status?.pendingTransactionsCount ?? 0;
  const isChainValid = status?.isChainValid ?? true;

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'shipments', label: 'Eco Shipments', icon: Package, badge: status?.activeShipments ? `${status.activeShipments} active` : null },
    { id: 'blockchain', label: 'Blockchain Ledger', icon: Boxes, badge: isChainValid ? null : 'Tampered!' },
    { id: 'mining', label: 'PoW Mining Lab', icon: Cpu, badge: pendingCount > 0 ? `${pendingCount} to mine` : null },
    { id: 'wallets', label: 'Wallets & Keys', icon: Wallet, badge: null },
    { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight, badge: pendingCount > 0 ? `${pendingCount}` : null },
    { id: 'merkle', label: 'Merkle Tree', icon: GitFork, badge: 'Visual' },
    { id: 'smart-contract', label: 'Smart Contract', icon: FileCode2, badge: 'Escrow' },
    { id: 'explorer', label: 'Chain Explorer', icon: Compass, badge: null },
    { id: 'hash', label: 'SHA-256 Sandbox', icon: Hash, badge: 'Live' },
    { id: 'demo', label: 'Guided Demo Tour', icon: Presentation, badge: '12 Topics' },
    { id: 'about', label: 'Concepts & Viva Prep', icon: BookOpen, badge: null },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 min-h-[calc(100vh-4rem)]">
      {/* Navigation List */}
      <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
        <div className="px-3 py-2 text-[11px] font-semibold tracking-wider uppercase text-slate-400">
          Core Modules
        </div>
        {menuItems.slice(0, 4).map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                    item.id === 'blockchain' && !isChainValid
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse'
                      : item.id === 'mining' && pendingCount > 0
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        <div className="px-3 pt-4 pb-2 text-[11px] font-semibold tracking-wider uppercase text-slate-400">
          Crypto Operations
        </div>
        {menuItems.slice(4, 10).map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                    item.badge === 'Live'
                      ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                      : item.badge === 'Visual'
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        <div className="px-3 pt-4 pb-2 text-[11px] font-semibold tracking-wider uppercase text-slate-400">
          Academic & Faculty
        </div>
        {menuItems.slice(10).map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40 text-xs space-y-2">
        <div className="flex items-center justify-between text-slate-400">
          <span>Target Difficulty:</span>
          <span className="font-mono text-emerald-400 font-semibold">
            {status?.difficulty || 2} zeros ({'0'.repeat(status?.difficulty || 2)})
          </span>
        </div>
        <div className="flex items-center justify-between text-slate-400">
          <span>Escrow Vault:</span>
          <span className="font-mono text-teal-300 font-semibold">{status?.escrowBalance || 0} ECO</span>
        </div>
        <div className="pt-2 border-t border-slate-800/60 flex items-center gap-1.5 text-[11px] text-slate-400">
          <Info className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>College Academic Mini-Project</span>
        </div>
      </div>
    </aside>
  );
}
