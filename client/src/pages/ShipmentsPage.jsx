import React, { useState } from 'react';
import {
  Package,
  PlusCircle,
  Truck,
  ArrowRight,
  CheckCircle2,
  Clock,
  MapPin,
  Leaf,
  ShieldCheck,
  AlertTriangle,
  FileCode2,
  Anchor,
  X
} from 'lucide-react';

export default function ShipmentsPage({
  shipments,
  wallets,
  onRefresh,
  onCreateShipment,
  onUpdateStatus
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingId, setLoadingId] = useState(null);
  const [actionMessage, setActionMessage] = useState(null);
  const [actionError, setActionError] = useState(null);

  // New Shipment Form State
  const [formData, setFormData] = useState({
    title: 'Recycled Ocean Plastic Textiles',
    sender: wallets?.find((w) => w.role === 'SHIPPER')?.address || '',
    receiver: wallets?.find((w) => w.role === 'RECEIVER')?.address || '',
    carrier: wallets?.find((w) => w.role === 'CARRIER')?.address || '',
    origin: 'Port of Valencia, Spain',
    destination: 'Port of Felixstowe, UK',
    packageType: 'Circular Sustainable Textiles',
    weight: 1200,
    ecoScore: 92,
    escrowAmount: 230
  });

  const handleStatusTransition = async (id, nextStatus) => {
    setLoadingId(id);
    setActionMessage(null);
    setActionError(null);
    try {
      const res = await onUpdateStatus(id, nextStatus);
      if (res.transitionResult?.releasedPayout > 0) {
        setActionMessage(
          `Smart Contract executed! Released ${res.transitionResult.releasedPayout} EcoCoins (Freight + Eco-Bonus) to carrier.`
        );
      } else {
        setActionMessage(`Status updated to "${nextStatus}" via Smart Contract validation.`);
      }
    } catch (err) {
      setActionError(err.message || 'Smart Contract rejected transition.');
    } finally {
      setLoadingId(null);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setActionMessage(null);
    setActionError(null);
    try {
      await onCreateShipment(formData);
      setIsModalOpen(false);
      setActionMessage('New eco-shipment created! Escrow locked & pending transaction queued.');
    } catch (err) {
      setActionError(err.message || 'Failed to create shipment.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Eco Shipments Management</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
              {shipments?.length || 0} Registered
            </span>
          </div>
          <p className="text-sm text-slate-400">
            Track cargo status across maritime supply chain with smart contract escrow protection.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-sm transition shadow-lg shadow-emerald-500/20 shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Eco Shipment</span>
        </button>
      </div>

      {/* Notifications */}
      {actionMessage && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{actionMessage}</span>
          </div>
          <button onClick={() => setActionMessage(null)} className="text-emerald-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {actionError && (
        <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{actionError}</span>
          </div>
          <button onClick={() => setActionError(null)} className="text-rose-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Shipments Cards Grid */}
      <div className="grid grid-cols-1 gap-5">
        {shipments?.map((shp) => {
          const isLoading = loadingId === shp.id;
          return (
            <div
              key={shp.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition space-y-5"
            >
              {/* Header row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-white">{shp.title}</h2>
                      <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700 font-semibold">
                        {shp.id}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">Package Type: {shp.packageType}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Eco Score badge */}
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                    <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Eco Score: {shp.ecoScore}/100</span>
                    <span className="text-slate-400 text-[11px]">({shp.carbonSavedKg} kg CO₂ saved)</span>
                  </div>

                  {/* Status badge */}
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider ${
                      shp.status === 'Delivered'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : shp.status === 'In Transit'
                        ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                        : shp.status === 'Picked Up'
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {shp.status}
                  </span>
                </div>
              </div>

              {/* Route & Cargo Specs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                <div className="p-3 rounded-lg bg-slate-950/50 border border-slate-800 space-y-1">
                  <span className="text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    Origin
                  </span>
                  <div className="font-semibold text-slate-200">{shp.origin}</div>
                </div>

                <div className="p-3 rounded-lg bg-slate-950/50 border border-slate-800 space-y-1">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Anchor className="w-3.5 h-3.5 text-teal-400" />
                    Destination
                  </span>
                  <div className="font-semibold text-slate-200">{shp.destination}</div>
                </div>

                <div className="p-3 rounded-lg bg-slate-950/50 border border-slate-800 space-y-1">
                  <span className="text-slate-400">Assigned Carrier</span>
                  <div className="font-semibold text-slate-200 truncate" title={shp.carrier}>
                    {shp.carrierName || 'Carrier'}
                  </div>
                  <div className="font-mono text-[10px] text-slate-500 truncate">{shp.carrier}</div>
                </div>

                <div className="p-3 rounded-lg bg-slate-950/50 border border-slate-800 space-y-1">
                  <span className="text-slate-400">Escrow Locked</span>
                  <div className="font-semibold text-emerald-400 text-sm">
                    {shp.escrowAmount} EcoCoins
                  </div>
                  <div className="text-[10px] text-slate-500">Weight: {shp.weight} kg</div>
                </div>
              </div>

              {/* Progress Flow Pipeline */}
              <div className="space-y-2">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Smart Contract Supply Chain Milestones
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {['Pending', 'Picked Up', 'In Transit', 'Delivered'].map((step, idx) => {
                    const stepOrder = ['Pending', 'Picked Up', 'In Transit', 'Delivered'];
                    const currentIdx = stepOrder.indexOf(shp.status);
                    const isCompleted = currentIdx >= idx;
                    const isCurrent = currentIdx === idx;

                    return (
                      <div
                        key={step}
                        className={`p-2.5 rounded-lg border text-center transition ${
                          isCompleted
                            ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                            : 'bg-slate-950/30 border-slate-800/80 text-slate-500'
                        }`}
                      >
                        <div className="text-[10px] font-mono text-slate-400">Step {idx + 1}</div>
                        <div className="text-xs font-semibold flex items-center justify-center gap-1 mt-0.5">
                          {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                          <span>{step}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Smart Contract Actions Row */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
                <div className="text-xs text-slate-400 flex items-center gap-1.5">
                  <FileCode2 className="w-3.5 h-3.5 text-teal-400" />
                  <span>Enforced by:</span>
                  <span className="font-mono text-slate-300">EcoShippingContract_v1.0</span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Step Buttons */}
                  {shp.status === 'Pending' && (
                    <button
                      disabled={isLoading}
                      onClick={() => handleStatusTransition(shp.id, 'Picked Up')}
                      className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition flex items-center gap-1.5 shadow"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Carrier Pick Up</span>
                    </button>
                  )}

                  {shp.status === 'Picked Up' && (
                    <button
                      disabled={isLoading}
                      onClick={() => handleStatusTransition(shp.id, 'In Transit')}
                      className="px-3.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold transition flex items-center gap-1.5 shadow"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                      <span>Depart In Transit</span>
                    </button>
                  )}

                  {shp.status === 'In Transit' && (
                    <button
                      disabled={isLoading}
                      onClick={() => handleStatusTransition(shp.id, 'Delivered')}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-emerald-600/30"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Confirm Delivery & Release Payout</span>
                    </button>
                  )}

                  {shp.status === 'Delivered' && (
                    <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold px-3 py-1 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Contract Completed & Escrow Paid</span>
                    </div>
                  )}

                  {/* Illegal jump demo button if not delivered */}
                  {shp.status === 'Pending' && (
                    <button
                      disabled={isLoading}
                      onClick={() => handleStatusTransition(shp.id, 'Delivered')}
                      className="px-2.5 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/40 text-rose-300 border border-rose-800/50 text-xs font-medium transition"
                      title="Test smart contract security by attempting an illegal skip straight from Pending to Delivered"
                    >
                      Test Illegal Jump
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Create Shipment */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-emerald-400" />
                <h3 className="text-lg font-bold text-white">Create New Eco Shipment</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Cargo Title / Description</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Shipper Wallet</label>
                  <select
                    value={formData.sender}
                    onChange={(e) => setFormData({ ...formData, sender: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                  >
                    {wallets?.map((w) => (
                      <option key={w.id} value={w.address}>
                        {w.name} ({w.balance} ECO)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Carrier Wallet</label>
                  <select
                    value={formData.carrier}
                    onChange={(e) => setFormData({ ...formData, carrier: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                  >
                    {wallets?.filter((w) => w.role === 'CARRIER').map((w) => (
                      <option key={w.id} value={w.address}>
                        {w.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Origin Port</label>
                  <input
                    type="text"
                    required
                    value={formData.origin}
                    onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Destination Port</label>
                  <input
                    type="text"
                    required
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.weight}
                    onChange={(e) => {
                      const wt = Number(e.target.value);
                      setFormData({
                        ...formData,
                        weight: wt,
                        escrowAmount: Math.round(wt * 0.15 + 50)
                      });
                    }}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Eco Score (0-100)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.ecoScore}
                    onChange={(e) => setFormData({ ...formData, ecoScore: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Escrow Fee (ECO)</label>
                  <input
                    type="number"
                    value={formData.escrowAmount}
                    onChange={(e) => setFormData({ ...formData, escrowAmount: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/80 border border-emerald-500/20 text-slate-400 space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Smart Contract Escrow Guarantee</span>
                </div>
                <p>
                  Upon creation, {formData.escrowAmount} EcoCoins will be transferred to the contract escrow vault.
                  Funds remain locked until verified delivery.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition shadow-lg shadow-emerald-500/20"
                >
                  Create & Lock Escrow
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
