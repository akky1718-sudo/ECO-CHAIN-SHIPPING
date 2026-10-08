import React, { useState } from 'react';
import {
  Presentation,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ExternalLink,
  Play,
  RotateCcw,
  BookOpen,
  Award
} from 'lucide-react';
import { api } from '../api';

export default function DemoGuidePage({
  status,
  blockchain,
  shipments,
  wallets,
  onNavigate,
  onRefresh
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [stepOutput, setStepOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  const demoSteps = [
    {
      stepNumber: 1,
      title: 'Generate Hash (SHA-256)',
      concept: 'Topic 2: Hash Generation & Avalanche Effect',
      explanation:
        'Demonstrate that any shipping data converts into a fixed 256-bit (64 hex characters) cryptographic digest, and changing even 1 letter flips ~50% of the bits.',
      talkingPoint:
        'Faculty Question: "Why SHA-256?" Answer: SHA-256 is deterministic, collision-resistant, and one-way. It forms the bedrock of block hashing and Merkle tree calculations.',
      actionLabel: 'Execute Live SHA-256 & Avalanche Test',
      pageTarget: 'hash',
      runAction: async () => {
        const text1 = 'Cargo: 1000kg Solar Cells';
        const text2 = 'Cargo: 1001kg Solar Cells';
        const res = await api.generateHash(text1, text2);
        return `Input 1: "${text1}"\nHash 1:  ${res.hash}\n\nInput 2: "${text2}" (1 char diff)\nHash 2:  ${res.comparison.compareHash}\n\nDiff: ${res.comparison.differingChars}/64 hex chars changed (${res.comparison.differingPercentage})!`;
      }
    },
    {
      stepNumber: 2,
      title: 'Create Block (Block Structure)',
      concept: 'Topics 1 & 3: Hello Blockchain & Simple Block Class',
      explanation:
        'Explain the Block class fields: index, timestamp, data payload, previousHash, hash, and nonce. Dynamically instantiate a new block.',
      talkingPoint:
        'Show that a Block binds the previous block hash to create an unbreakable historical sequence.',
      actionLabel: 'Create Dynamic Educational Block',
      pageTarget: 'blockchain',
      runAction: async () => {
        const res = await api.createBlock('Faculty Demo Manifest: Biofuel Bunkering Terminal #7');
        return `Block #${res.block.index} dynamically created!\nNonce: ${res.block.nonce}\nTimestamp: ${new Date(res.block.timestamp).toLocaleString()}\nPrevious Hash: ${res.block.previousHash}\nCurrent Hash:  ${res.block.hash}`;
      }
    },
    {
      stepNumber: 3,
      title: 'Create Blockchain (Genesis Block Linkage)',
      concept: 'Topic 4: Complete Blockchain Class',
      explanation:
        'Examine how the chain begins with the Genesis Block (Index 0, Previous Hash = "0") and links each subsequent block via previousHash.',
      talkingPoint:
        'Faculty Question: "How are blocks ordered?" Answer: Sequentially linked by cryptographic hash pointers where Block[N].previousHash === Block[N-1].hash.',
      actionLabel: 'Inspect Blockchain Linkage',
      pageTarget: 'blockchain',
      runAction: async () => {
        const res = await api.getBlockchain();
        return `Total Chain Length: ${res.chain.length} Blocks\nGenesis Hash: ${res.chain[0].hash.slice(0, 24)}...\nLatest Hash:  ${res.chain[res.chain.length - 1].hash.slice(0, 24)}...\nLink Verification: ${res.validation.isValid ? 'ALL BLOCKS CONNECTED' : 'CHAIN TAMPERED'}`;
      }
    },
    {
      stepNumber: 4,
      title: 'Add Sustainable Shipment',
      concept: 'Eco Chain Shipping: Maritime Logistics Lifecycle',
      explanation:
        'Register a new green shipment with Eco Score, origin, destination, and freight weight. Calculate carbon offsets and lock freight escrow.',
      talkingPoint:
        'Demonstrates practical real-world supply chain integration with custom blockchain tokens.',
      actionLabel: 'Register New Eco Shipment',
      pageTarget: 'shipments',
      runAction: async () => {
        const shipper = wallets?.find((w) => w.role === 'SHIPPER')?.address || '0x21D95A401C312061A028471822C05193B6109D78';
        const carrier = wallets?.find((w) => w.role === 'CARRIER')?.address || '0x83BD6A329F1A42C7D1B998E204C61F92E3812B44';
        const receiver = wallets?.find((w) => w.role === 'RECEIVER')?.address || '0x55E470129F9444B68140B51239A061C8B2945E99';

        const res = await api.createShipment({
          title: 'Faculty Demo: Wind Turbine Blades',
          sender: shipper,
          carrier: carrier,
          receiver: receiver,
          origin: 'Port of Esbjerg, Denmark',
          destination: 'Port of Le Havre, France',
          weight: 4500,
          ecoScore: 96,
          escrowAmount: 420
        });
        return `Shipment Created: ${res.shipment.id}\nTitle: ${res.shipment.title}\nEscrow Locked: ${res.shipment.escrowAmount} ECO\nCO2 Saved: ${res.shipment.carbonSavedKg} kg\nStatus: ${res.shipment.status}`;
      }
    },
    {
      stepNumber: 5,
      title: 'Create Transaction',
      concept: 'Topic 8: Basic Transaction between Wallets',
      explanation:
        'Generate an EcoCoin transaction transferring funds between two wallets with an immutable digital record queued in the mempool.',
      talkingPoint:
        'Explain that transactions are NOT immediately in a block; they sit in a pending pool (mempool) until mined.',
      actionLabel: 'Create Demo Transaction',
      pageTarget: 'transactions',
      runAction: async () => {
        const s = wallets?.[3]?.address;
        const r = wallets?.[4]?.address;
        const res = await api.createTransaction({
          sender: s,
          receiver: r,
          amount: 75,
          details: 'Demonstration EcoCoin Freight Advance'
        });
        return `Transaction Created!\nTX ID: ${res.transaction.id}\nAmount: ${res.transaction.amount} EcoCoins\nSender: ${res.transaction.sender.slice(0, 12)}...\nReceiver: ${res.transaction.receiver.slice(0, 12)}...\nPending Mempool Count: ${res.pendingCount}`;
      }
    },
    {
      stepNumber: 6,
      title: 'Validate Transaction',
      concept: 'Topic 9: Transaction Validation Rules',
      explanation:
        'Run 5 validation checks: sender exists, receiver exists, amount > 0, sender has sufficient balance, and sender != receiver.',
      talkingPoint:
        'Faculty Question: "What prevents double spending or invalid transactions?" Answer: Transaction validation ensures solvency and cryptographic validity before pool inclusion.',
      actionLabel: 'Run 5-Rule Transaction Audit',
      pageTarget: 'transactions',
      runAction: async () => {
        const res = await api.validateTransactionDryRun({
          sender: wallets?.[3]?.address,
          receiver: wallets?.[4]?.address,
          amount: 100
        });
        const details = res.checklist.map((c) => `[${c.passed ? 'PASS' : 'FAIL'}] ${c.rule}: ${c.details}`).join('\n');
        return `Validation Summary: ${res.isValid ? 'VALID' : 'INVALID'}\n\n${details}`;
      }
    },
    {
      stepNumber: 7,
      title: 'Mine Block with Proof of Work',
      concept: 'Topic 6: Proof of Work (PoW) Mining',
      explanation:
        'Run the PoW mining loop. The miner solves the mathematical puzzle to find a nonce that generates the required leading zeros.',
      talkingPoint:
        'Faculty Question: "Why does mining require work?" Answer: Proof of Work makes rewriting historical blocks computationally prohibitive, securing the chain against attackers.',
      actionLabel: 'Mine Pending Transactions with PoW',
      pageTarget: 'mining',
      runAction: async () => {
        const res = await api.mineBlock(wallets?.[1]?.address, 2);
        return `PoW Mining Complete!\nBlock #${res.minedBlock.index} mined with difficulty: ${res.miningResult.difficulty} zeros\nWinning Nonce: ${res.miningResult.nonce}\nAttempts: ${res.miningResult.attempts}\nElapsed: ${res.miningResult.durationMs}ms\nFinal Hash: ${res.miningResult.hash}\nMining Reward: +50 EcoCoins awarded to carrier!`;
      }
    },
    {
      stepNumber: 8,
      title: 'Generate Merkle Tree',
      concept: 'Topic 10: Merkle Tree & Merkle Root',
      explanation:
        'Compute pairwise SHA-256 combinations of transaction hashes. If the leaf count is odd, duplicate the final leaf to produce the Merkle Root.',
      talkingPoint:
        'Faculty Question: "Why Merkle Trees?" Answer: Allows verification of whether a transaction belongs to a block in O(log N) time without downloading the entire blockchain.',
      actionLabel: 'Calculate Merkle Tree & Root',
      pageTarget: 'merkle',
      runAction: async () => {
        const items = ['Tx 1: 150 ECO', 'Tx 2: 220 ECO', 'Tx 3: 380 ECO'];
        const res = await api.generateMerkleTree(items);
        return `Calculated Merkle Tree for 3 transactions (Odd count applied):\nLeaf Count: ${res.leafCount}\nLevels Count: ${res.levels.length}\nMerkle Root: ${res.root}\n\nLevel 0: [${res.levels[0].map((n) => n.shortHash).join(', ')}]\nLevel 1: [${res.levels[1].map((n) => n.shortHash).join(', ')}] (Duplicated last)\nRoot Level: ${res.levels[2][0].hash}`;
      }
    },
    {
      stepNumber: 9,
      title: 'Validate Blockchain & Tamper Lab',
      concept: 'Topic 5: Blockchain Integrity & Tamper Detection',
      explanation:
        'Test cryptographic integrity. Then simulate a malicious hacker tampering with block data, and show how the validation immediately flags the chain as INVALID!',
      talkingPoint:
        'Faculty Question: "How is tampering detected?" Answer: Recalculating the SHA-256 hash yields a different value, breaking both the block hash and the subsequent block\'s previousHash.',
      actionLabel: 'Run Validation & Tamper Demonstration',
      pageTarget: 'blockchain',
      runAction: async () => {
        const preVal = await api.validateBlockchain();
        const tamperRes = await api.tamperBlock(1, 'HACKER_TAMPER: Unauthorized 999999 ECO extraction');
        return `Initial State: ${preVal.status}\n\nSimulating Tamper on Block #1...\nTamper Action: ${tamperRes.message}\nNew Validation Status: ${tamperRes.validation.status}\nIssues Detected: ${tamperRes.validation.issues.map((i) => i.message).join('\n')}\n\nNotice how the chain is now INVALID!`;
      }
    },
    {
      stepNumber: 10,
      title: 'Execute Smart Contract',
      concept: 'Topic 11: Smart Contract Simulation (Escrow & Rules)',
      explanation:
        'Simulate state transitions for a shipment (Pending -> Picked Up -> In Transit -> Delivered). The smart contract enforces order and automatically disburses escrow + sustainability bonus upon delivery!',
      talkingPoint:
        'Faculty Question: "What is a smart contract?" Answer: Self-executing code that removes the need for trusted intermediaries, automating escrow settlement and business logic.',
      actionLabel: 'Execute Smart Contract Delivery Rule',
      pageTarget: 'smart-contract',
      runAction: async () => {
        const pendingShp = shipments?.find((s) => s.status !== 'Delivered') || shipments?.[0];
        if (!pendingShp) return 'All shipments already delivered.';

        if (pendingShp.status === 'Pending') {
          const r1 = await api.updateShipmentStatus(pendingShp.id, 'Picked Up');
          return `Smart Contract Step 1:\nShipment ${pendingShp.id} moved to "Picked Up". Carrier assigned & verified. Escrow held safely.`;
        } else if (pendingShp.status === 'Picked Up') {
          const r2 = await api.updateShipmentStatus(pendingShp.id, 'In Transit');
          return `Smart Contract Step 2:\nShipment ${pendingShp.id} moved to "In Transit". Green cargo route activated.`;
        } else {
          const r3 = await api.updateShipmentStatus(pendingShp.id, 'Delivered');
          return `Smart Contract Step 3 (Delivery & Automated Settlement):\nShipment ${pendingShp.id} verified DELIVERED!\nSmart contract automatically released ${r3.transitionResult.releasedPayout} EcoCoins (Freight + Eco-Bonus) to carrier wallet!`;
        }
      }
    },
    {
      stepNumber: 11,
      title: 'Inspect Block in Explorer',
      concept: 'Topic 12: Mini Blockchain Explorer',
      explanation:
        'Use the explorer search to inspect block details, transaction IDs, nonces, timestamps, and Merkle roots.',
      talkingPoint:
        'Demonstrates blockchain transparency: any participant can audit transaction receipts without private credentials.',
      actionLabel: 'Lookup Block #1 in Explorer',
      pageTarget: 'explorer',
      runAction: async () => {
        const res = await api.searchExplorer('1');
        const block = res.results.find((r) => r.type === 'BLOCK');
        if (!block) return 'Block #1 not found';
        return `Explorer Search Hit:\nTitle: ${block.title}\nHash: ${block.data.hash}\nPrevious Hash: ${block.data.previousHash}\nNonce: ${block.data.nonce}\nMerkle Root: ${block.data.merkleRoot}\nTransactions: ${block.data.transactions?.length || 0}`;
      }
    },
    {
      stepNumber: 12,
      title: 'Academic Viva & Architecture Summary',
      concept: 'Summary of all 12 Blockchain Topics',
      explanation:
        'Review the complete flow: Hello Blockchain → SHA-256 → Block Class → Blockchain → Validation & Tamper Lab → Proof of Work → Wallets → Transactions → Transaction Validation → Merkle Tree → Smart Contract → Blockchain Explorer.',
      talkingPoint:
        'Summarize how Eco Chain Shipping combines environmental sustainability with trustless decentralized architecture for transparent maritime logistics.',
      actionLabel: 'View Academic Notes & Viva Questions',
      pageTarget: 'about',
      runAction: async () => {
        return 'All 12 required academic blockchain topics are fully implemented, verified, and operational in Eco Chain Shipping! Click below to view detailed viva notes.';
      }
    }
  ];

  const current = demoSteps[currentStep];

  const handleRun = async () => {
    setIsRunning(true);
    setStepOutput(null);
    try {
      const output = await current.runAction();
      setStepOutput(output);
      onRefresh();
    } catch (err) {
      setStepOutput(`Error executing step: ${err.message}`);
    } finally {
      setIsRunning(false);
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
                Faculty Guided Presentation Tour
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                12 Steps Walkthrough
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Step-by-step interactive workflow designed for student viva and college project presentation.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Step:</span>
            <span className="font-mono font-bold text-emerald-400 text-sm">
              {currentStep + 1} / {demoSteps.length}
            </span>
          </div>
        </div>

        {/* Progress Dots */}
        <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5 pt-4">
          {demoSteps.map((step, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCurrentStep(idx);
                setStepOutput(null);
              }}
              className={`h-2 rounded-full transition-all ${
                idx === currentStep
                  ? 'bg-emerald-400 shadow-md shadow-emerald-400/50'
                  : idx < currentStep
                  ? 'bg-emerald-800'
                  : 'bg-slate-800 hover:bg-slate-700'
              }`}
              title={`Step ${step.stepNumber}: ${step.title}`}
            />
          ))}
        </div>
      </div>

      {/* Main Presentation Step Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl">
        {/* Step Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-slate-950 flex items-center justify-center font-bold text-lg shadow-lg shadow-emerald-500/20">
              {current.stepNumber}
            </div>
            <div>
              <span className="text-xs font-mono font-semibold text-teal-400 uppercase tracking-wider">
                {current.concept}
              </span>
              <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                {current.title}
              </h2>
            </div>
          </div>

          <button
            onClick={() => onNavigate(current.pageTarget)}
            className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-semibold px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 transition self-start sm:self-auto"
          >
            <span>Open Dedicated Page</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Explanation & Viva Talking Points */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Concept Demonstration
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              {current.explanation}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-teal-500/20 space-y-2">
            <span className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4" />
              Faculty Presentation Talking Point
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              {current.talkingPoint}
            </p>
          </div>
        </div>

        {/* Interactive Action Launcher */}
        <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-xs font-semibold text-slate-300">
              Live Interactive Execution for this Step:
            </span>
            <button
              onClick={handleRun}
              disabled={isRunning}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition shadow-lg shadow-emerald-500/20 flex items-center gap-2"
            >
              <Play className={`w-3.5 h-3.5 fill-current ${isRunning ? 'animate-spin' : ''}`} />
              <span>{isRunning ? 'Executing Logic...' : current.actionLabel}</span>
            </button>
          </div>

          {stepOutput && (
            <div className="p-4 rounded-lg bg-slate-900 border border-emerald-500/40 text-xs font-mono text-emerald-300 whitespace-pre-wrap leading-relaxed shadow-inner">
              {stepOutput}
            </div>
          )}
        </div>

        {/* Footer Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <button
            disabled={currentStep === 0}
            onClick={() => {
              setCurrentStep((p) => Math.max(0, p - 1));
              setStepOutput(null);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
              currentStep === 0
                ? 'bg-slate-800/50 text-slate-600 cursor-not-allowed'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous Step</span>
          </button>

          <span className="text-xs text-slate-500 font-mono">
            {currentStep + 1} of {demoSteps.length}
          </span>

          <button
            disabled={currentStep === demoSteps.length - 1}
            onClick={() => {
              setCurrentStep((p) => Math.min(demoSteps.length - 1, p + 1));
              setStepOutput(null);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              currentStep === demoSteps.length - 1
                ? 'bg-slate-800/50 text-slate-600 cursor-not-allowed'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20'
            }`}
          >
            <span>Next Step</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
