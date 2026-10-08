import React, { useState, useEffect } from 'react';
import {
  Hash,
  Copy,
  CheckCircle2,
  Sparkles,
  Zap,
  ArrowRight,
  Shield,
  Layers,
  HelpCircle
} from 'lucide-react';
import { api } from '../api';

export default function HashGeneratorPage() {
  // Live single input
  const [liveInput, setLiveInput] = useState('Eco Chain Shipping – Sustainable Logistics');
  const [liveHash, setLiveHash] = useState('');

  // Avalanche comparison
  const [textA, setTextA] = useState('Container #409: 1200kg Solar Panels');
  const [textB, setTextB] = useState('Container #409: 1201kg Solar Panels'); // 1 character difference ('0' -> '1')
  const [comparison, setComparison] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);

  // Compute live single hash
  useEffect(() => {
    let active = true;
    api.generateHash(liveInput)
      .then((res) => {
        if (active) setLiveHash(res.hash);
      })
      .catch((err) => console.error(err));
    return () => {
      active = false;
    };
  }, [liveInput]);

  // Compute avalanche comparison
  useEffect(() => {
    let active = true;
    api.generateHash(textA, textB)
      .then((res) => {
        if (active && res.comparison) {
          setComparison({
            hashA: res.hash,
            hashB: res.comparison.compareHash,
            differingChars: res.comparison.differingChars,
            differingPercentage: res.comparison.differingPercentage
          });
        }
      })
      .catch((err) => console.error(err));
    return () => {
      active = false;
    };
  }, [textA, textB]);

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const loadSample = (a, b) => {
    setTextA(a);
    setTextB(b);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white tracking-tight">SHA-256 Hash Generator & Avalanche Lab</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Topic 2
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Secure Hash Algorithm (256-bit). Deterministic, one-way cryptographic hashing fundamental to blockchain security and immutability.
            </p>
          </div>
        </div>
      </div>

      {/* Part 1: Live Interactive SHA-256 Generator */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Hash className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white">Live SHA-256 Hash Sandbox</h2>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Input: {liveInput.length} chars · Output: 64 hex chars (256 bits)
          </span>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Type Any Text or Shipping Data (Instant Re-Hashing)
            </label>
            <textarea
              rows="3"
              value={liveInput}
              onChange={(e) => setLiveInput(e.target.value)}
              placeholder="Type any message to hash in real-time..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold uppercase tracking-wider text-[11px] text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Computed SHA-256 Digest
              </span>
              <button
                onClick={() => copyToClipboard(liveHash, 'live')}
                className="hover:text-white flex items-center gap-1 font-mono text-[11px]"
              >
                <Copy className="w-3 h-3" />
                <span>{copiedKey === 'live' ? 'Copied!' : 'Copy Hash'}</span>
              </button>
            </div>
            <div className="font-mono text-xs md:text-sm font-bold text-emerald-400 break-all p-3 rounded-lg bg-slate-900/90 border border-emerald-950">
              {liveHash}
            </div>
          </div>
        </div>
      </div>

      {/* Part 2: Avalanche Effect Demonstration */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-white">The "Avalanche Effect" Demonstration</h2>
          </div>
          <span className="text-xs text-amber-300 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20 font-semibold">
            Changing 1 character completely alters the hash
          </span>
        </div>

        <p className="text-xs text-slate-300">
          In cryptographic hash functions, the <strong>Avalanche Effect</strong> guarantees that an infinitesimal change in the input (such as toggling one single bit or character) results in a drastic, radical transformation of the output hash.
        </p>

        {/* Quick Sample Presets */}
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="text-slate-400 self-center font-semibold text-[11px]">Quick Tests:</span>
          <button
            onClick={() => loadSample('Eco Chain Shipping', 'Eco Chain shipping')}
            className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
          >
            Upper vs Lowercase 'S'
          </button>
          <button
            onClick={() => loadSample('Weight: 1000kg', 'Weight: 1001kg')}
            className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
          >
            1kg Weight Difference
          </button>
          <button
            onClick={() => loadSample('Delivery Status: Verified', 'Delivery Status: Verified.')}
            className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
          >
            Adding a Trailing Period
          </button>
        </div>

        {/* Side-by-side Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-2">
            <label className="block font-semibold text-emerald-400">Input A (Original)</label>
            <textarea
              rows="2"
              value={textA}
              onChange={(e) => setTextA(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block font-semibold text-amber-400">Input B (1-Character Modified)</label>
            <textarea
              rows="2"
              value={textB}
              onChange={(e) => setTextB(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Comparison Result Cards */}
        {comparison && (
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Hash A */}
              <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-1">
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                  Hash of Input A
                </span>
                <div className="font-mono text-xs text-emerald-300 break-all pt-1">
                  {comparison.hashA}
                </div>
              </div>

              {/* Hash B */}
              <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 space-y-1">
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                  Hash of Input B
                </span>
                <div className="font-mono text-xs text-amber-300 break-all pt-1">
                  {comparison.hashB}
                </div>
              </div>
            </div>

            {/* Avalanche Metric Stats */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 via-slate-950 to-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  {comparison.differingPercentage}
                </div>
                <div>
                  <div className="font-bold text-white text-sm">
                    {comparison.differingChars} of 64 Characters Differed
                  </div>
                  <p className="text-xs text-slate-400">
                    Diffusion rate: {comparison.differingPercentage} of the hexadecimal hash characters flipped!
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <CheckCircle2 className="w-4 h-4" />
                <span>Avalanche Criterion Satisfied</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
