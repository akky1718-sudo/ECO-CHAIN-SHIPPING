import React from 'react';
import {
  Boxes,
  ArrowLeftRight,
  Package,
  CheckCircle2,
  Layers,
  Wallet,
  ShieldCheck,
  ShieldAlert,
  Leaf,
  Cpu,
  ArrowRight,
  ExternalLink,
  PlusCircle,
  Truck,
  Anchor,
  Sparkles
} from 'lucide-react';

export default function DashboardPage({
  status,
  shipments,
  blockchain,
  onNavigate,
  onMine
}) {
  const isValid = status?.isChainValid ?? true;
  const recentBlocks = blockchain?.chain?.slice(-3).reverse() || [];
  const activeShipmentList = shipments?.filter((s) => s.status !== 'Delivered') || [];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border border-emerald-500/30 p-6 md:p-8 shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Academic Mini-Project Demonstration</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Eco Chain Shipping Ledger
          </h1>
          <p className="text-sm md:text-base text-slate-300 leading-relaxed">
            A blockchain-based sustainable shipping management system ensuring cryptographic immutability, 
            transparent Proof-of-Work mining, automated Smart Contract escrows, and Merkle-tree verified transactions.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('shipments')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-sm transition shadow-lg shadow-emerald-500/20"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Shipment</span>
            </button>
            <button
              onClick={() => onNavigate('mining')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg text-sm border border-slate-700 transition"
            >
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span>Mine Pending Blocks</span>
            </button>
            <button
              onClick={() => onNavigate('demo')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-teal-950/60 hover:bg-teal-900/60 text-teal-300 font-semibold rounded-lg text-sm border border-teal-700/50 transition"
            >
              <span>Faculty Demo Tour (12 Topics)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-gradient-to-l from-emerald-500/10 to-transparent pointer-events-none" />
        <Leaf className="absolute -right-8 -bottom-8 w-64 h-64 text-emerald-500/5 pointer-events-none" />
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Blocks */}
        <div 
          onClick={() => onNavigate('blockchain')}
          className="cursor-pointer bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-500/40 rounded-xl p-5 transition group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Blocks</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition">
              <Boxes className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {status?.totalBlocks || 0}
          </div>
          <p className="text-xs text-slate-400 flex items-center gap-1">
            <span>Latest:</span>
            <span className="font-mono text-emerald-400 font-semibold">Block #{status?.latestBlockIndex || 0}</span>
          </p>
        </div>

        {/* Total Transactions */}
        <div 
          onClick={() => onNavigate('transactions')}
          className="cursor-pointer bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-500/40 rounded-xl p-5 transition group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Transactions</span>
            <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400 group-hover:scale-110 transition">
              <ArrowLeftRight className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {status?.totalTransactions || 0}
          </div>
          <p className="text-xs text-slate-400">
            {status?.confirmedTransactions || 0} confirmed · {status?.pendingTransactionsCount || 0} pending
          </p>
        </div>

        {/* Active & Delivered Shipments */}
        <div 
          onClick={() => onNavigate('shipments')}
          className="cursor-pointer bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-500/40 rounded-xl p-5 transition group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Active Shipments</span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 group-hover:scale-110 transition">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {status?.activeShipments || 0}
          </div>
          <p className="text-xs text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{status?.deliveredShipments || 0} successfully delivered</span>
          </p>
        </div>

        {/* Blockchain Status */}
        <div 
          onClick={() => onNavigate('blockchain')}
          className={`cursor-pointer border rounded-xl p-5 transition group ${
            isValid
              ? 'bg-slate-900 hover:bg-slate-800/80 border-slate-800 hover:border-emerald-500/40'
              : 'bg-rose-950/40 border-rose-700/60'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Blockchain Status</span>
            <div className={`p-2 rounded-lg ${isValid ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/20 text-rose-400 animate-bounce'}`}>
              {isValid ? <ShieldCheck className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
            </div>
          </div>
          <div className={`text-xl font-bold mb-1 ${isValid ? 'text-emerald-400' : 'text-rose-400'}`}>
            {status?.blockchainStatus || 'Blockchain Valid'}
          </div>
          <p className="text-xs text-slate-400">
            {isValid ? 'Cryptographic hashes intact' : 'Block tampering detected!'}
          </p>
        </div>
      </div>

      {/* Secondary Metrics: Environmental Impact & Escrow */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Eco Sustainability Metric */}
        <div className="bg-gradient-to-br from-emerald-950/50 to-slate-900 border border-emerald-500/20 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-emerald-400 uppercase font-semibold">CO₂ Offset Saved</div>
              <div className="text-2xl font-bold text-white">{status?.totalCarbonSavedKg || 0} kg</div>
            </div>
          </div>
          <p className="text-xs text-slate-400">
            Calculated via electric cargo routing and sustainable biofuel freight partners.
          </p>
        </div>

        {/* Smart Contract Escrow Vault */}
        <div 
          onClick={() => onNavigate('smart-contract')}
          className="cursor-pointer bg-slate-900 hover:bg-slate-800/80 border border-slate-800 rounded-xl p-5 transition"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs text-slate-400 uppercase font-semibold">Contract Escrow Vault</div>
            <span className="text-[10px] bg-teal-500/10 text-teal-400 px-2 py-0.5 rounded-full border border-teal-500/20">
              Active Locks
            </span>
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {status?.escrowBalance || 0} <span className="text-emerald-400 text-lg">EcoCoins</span>
          </div>
          <p className="text-xs text-slate-400">
            Funds automatically disbursed upon confirmed maritime delivery.
          </p>
        </div>

        {/* Mempool & Mining Status */}
        <div 
          onClick={() => onNavigate('mining')}
          className="cursor-pointer bg-slate-900 hover:bg-slate-800/80 border border-slate-800 rounded-xl p-5 transition"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs text-slate-400 uppercase font-semibold">Mining Difficulty</div>
            <span className="text-[10px] bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/20">
              PoW Target
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mb-1">
            {'0'.repeat(status?.difficulty || 2)}
            <span className="text-xs text-slate-400 font-sans ml-2">({status?.difficulty || 2} zeros)</span>
          </div>
          <p className="text-xs text-slate-400">
            {status?.pendingTransactionsCount || 0} transactions ready in mempool for block inclusion.
          </p>
        </div>
      </div>

      {/* Main Content Two-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Shipments Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-emerald-400" />
              <h2 className="font-bold text-white text-base">Active Eco Shipments</h2>
            </div>
            <button
              onClick={() => onNavigate('shipments')}
              className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold"
            >
              <span>View All ({shipments?.length || 0})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto">
            {activeShipmentList.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-sm">
                No active shipments currently in transit.
              </div>
            ) : (
              activeShipmentList.map((shp) => (
                <div
                  key={shp.id}
                  className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-emerald-400">{shp.id}</span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        shp.status === 'Pending'
                          ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                          : shp.status === 'Picked Up'
                          ? 'bg-blue-500/10 text-blue-300 border border-blue-500/20'
                          : 'bg-teal-500/10 text-teal-300 border border-teal-500/20'
                      }`}
                    >
                      {shp.status}
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-white">{shp.title}</div>
                  <div className="text-xs text-slate-400 flex items-center justify-between">
                    <span className="truncate max-w-[200px]">{shp.origin} → {shp.destination}</span>
                    <span className="font-semibold text-teal-300">Score: {shp.ecoScore}/100</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Mined Blocks */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Boxes className="w-5 h-5 text-teal-400" />
              <h2 className="font-bold text-white text-base">Latest Blocks on Chain</h2>
            </div>
            <button
              onClick={() => onNavigate('blockchain')}
              className="text-xs text-teal-400 hover:text-teal-300 flex items-center gap-1 font-semibold"
            >
              <span>Explore Chain</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto">
            {recentBlocks.map((blk) => (
              <div
                key={blk.index}
                className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-xs font-bold border border-emerald-500/20">
                      Block #{blk.index}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {new Date(blk.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    Nonce: {blk.nonce}
                  </span>
                </div>
                <div className="text-xs text-slate-300 truncate">
                  {typeof blk.data === 'string' ? blk.data : JSON.stringify(blk.data)}
                </div>
                <div className="font-mono text-[11px] text-slate-400 truncate bg-slate-900 px-2 py-1 rounded">
                  Hash: <span className="text-emerald-400">{blk.hash}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
