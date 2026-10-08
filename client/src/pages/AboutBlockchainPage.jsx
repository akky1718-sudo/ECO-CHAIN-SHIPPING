import React, { useState } from 'react';
import {
  BookOpen,
  HelpCircle,
  ShieldCheck,
  Cpu,
  Layers,
  FileCode2,
  GitFork,
  Hash,
  Boxes,
  Key,
  ChevronDown,
  ChevronUp,
  Sparkles
} from 'lucide-react';

export default function AboutBlockchainPage() {
  const [openFaq, setOpenFaq] = useState(0);

  const concepts = [
    {
      num: 1,
      title: 'Hello Blockchain & Block Structure',
      icon: Boxes,
      definition:
        'A blockchain is a decentralized, distributed, and append-only ledger composed of cryptographically chained records called blocks.',
      details:
        'Each block contains: Index (Block number), Timestamp (Unix epoch), Data (manifest payload), Previous Hash (link to previous block), Current Hash (SHA-256 digest), Nonce (PoW counter), and Merkle Root.'
    },
    {
      num: 2,
      title: 'SHA-256 Hash Generation & Avalanche Effect',
      icon: Hash,
      definition:
        'SHA-256 is a 256-bit secure hash algorithm developed by the NSA. It transforms arbitrary input data into a fixed-length 64-character hexadecimal string.',
      details:
        'Key properties include Determinism, Pre-image resistance (one-way function), Collision resistance, and the Avalanche Effect (flipping one bit alters roughly 50% of output bits).'
    },
    {
      num: 3,
      title: 'Simple Block Class Creation',
      icon: Layers,
      definition:
        'Encapsulating block properties and operations inside an object-oriented class model.',
      details:
        'Our Block class defines calculateHash(), mineBlock(difficulty), and validation logic. It stores previousHash, timestamp, transactions, nonce, and hash.'
    },
    {
      num: 4,
      title: 'Create Blockchain & Genesis Block',
      icon: Boxes,
      definition:
        'A sequence of linked Block instances starting from Block 0 (the Genesis Block).',
      details:
        'The Genesis Block has previousHash = "0". Each subsequent block sets previousHash equal to the hash of the latest block on the chain, establishing an unbreakable cryptographic chain.'
    },
    {
      num: 5,
      title: 'Validate Blockchain & Tamper Detection',
      icon: ShieldCheck,
      definition:
        'Verifying that no block has been altered and that all hash pointers connect accurately.',
      details:
        'Validation checks: (1) Recomputed hash matches current hash, (2) Previous hash matches earlier block hash, (3) Merkle root integrity, (4) PoW difficulty prefix condition satisfied.'
    },
    {
      num: 6,
      title: 'Proof of Work (Mining) & Difficulty',
      icon: Cpu,
      definition:
        'Consensus mechanism where miners expend CPU cycles to find a nonce that yields a block hash satisfying a target difficulty (leading zeros).',
      details:
        'Difficulty = D means hash must start with D zeros. With difficulty 4, search space has 16^4 = 65,536 combinations on average. Prevents spam and history rewriting.'
    },
    {
      num: 7,
      title: 'Simple Wallets & Simulated Keys',
      icon: Key,
      definition:
        'Asymmetric cryptography abstraction holding a Public Key (address for receiving) and Private Key (for authorization).',
      details:
        'In this academic mini-project, keys are simulated and clearly marked for demonstration to prevent confusion with real cryptocurrency networks.'
    },
    {
      num: 8,
      title: 'Basic Transactions & Mempool',
      icon: Layers,
      definition:
        'Peer-to-peer value transfer representing EcoCoin payments or escrow locks.',
      details:
        'Fields: Transaction ID, Sender address, Receiver address, Amount, Timestamp, Type, and Simulated Signature. Sits in the Mempool before block mining.'
    },
    {
      num: 9,
      title: 'Transaction Validation Rules',
      icon: ShieldCheck,
      definition:
        'Solvency and business rule verification before transaction inclusion.',
      details:
        'Rules: (1) Sender exists, (2) Receiver exists, (3) Amount > 0, (4) Sender has sufficient balance, (5) Sender and receiver are distinct addresses.'
    },
    {
      num: 10,
      title: 'Merkle Tree (Odd & Even Handling)',
      icon: GitFork,
      definition:
        'Binary cryptographic hash tree summarizing all transactions in a block into a single root hash.',
      details:
        'Pairwise combination: Hash(A + B). If the leaf count is odd, the last leaf hash is duplicated. Enables O(log N) Simplified Payment Verification (SPV).'
    },
    {
      num: 11,
      title: 'Smart Contract Simulation',
      icon: FileCode2,
      definition:
        'Self-executing agreement containing pre-programmed rules that autonomously release escrow upon verified shipping delivery.',
      details:
        'Enforces state sequence: Pending -> Picked Up -> In Transit -> Delivered. Rejects illegal skips. Mints +25 EcoCoin sustainability bonus for green Eco Score >= 80.'
    },
    {
      num: 12,
      title: 'Mini Blockchain Explorer',
      icon: BookOpen,
      definition:
        'Public search engine and transparency interface into ledger blocks and transactions.',
      details:
        'Allows looking up blocks by index or hash, inspecting transaction IDs, viewing nonces, timestamps, and validating data authenticity without credentials.'
    }
  ];

  const faqs = [
    {
      q: 'Why is a blockchain considered immutable?',
      a: 'Because every block contains the hash of the previous block. If an attacker modifies data in Block #1, its SHA-256 hash changes completely (Avalanche Effect). This immediately breaks the "previousHash" link in Block #2 and all subsequent blocks. To forge history, an attacker would need to re-mine all subsequent blocks, which is computationally infeasible under Proof of Work.'
    },
    {
      q: 'What is a Nonce and why is it needed in Proof of Work?',
      a: 'Nonce stands for "Number used Once". Since the block\'s transaction data, timestamp, and previous hash are fixed, miners cannot alter them arbitrarily. The nonce is an arbitrary integer that the miner increments in a loop until the SHA-256 hash meets the network\'s difficulty target (e.g. starting with "0000").'
    },
    {
      q: 'Why do we duplicate the last node in an odd-length Merkle Tree?',
      a: 'A Merkle tree requires pairwise concatenation (left + right child) at every step to calculate parent hashes. If a level has an odd number of nodes (e.g., 3 nodes: A, B, C), node C has no partner. By convention (as in Bitcoin), the odd node is paired with itself: Hash(C + C). This maintains a balanced binary tree until reaching a single Merkle Root.'
    },
    {
      q: 'How does the Smart Contract in Eco Chain Shipping work?',
      a: 'It acts as an automated escrow vault. When a shipper creates a shipment, freight funds are locked in the contract. As the cargo moves through verified checkpoints (Pending -> Picked Up -> In Transit -> Delivered), the contract strictly enforces that milestones cannot be skipped. Once "Delivered" is verified, the contract automatically disburses the escrow payment to the carrier along with a sustainability bonus (+25 ECO) if the Eco Score was 80 or higher.'
    },
    {
      q: 'What is the purpose of EcoCoins in this project?',
      a: 'EcoCoins are simulated utility tokens used for freight escrow locks, miner incentives, and sustainability reward bonuses. They illustrate tokenomics and value transfers in a closed academic blockchain simulation without real financial risk.'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Academic Blockchain Guide & Viva Notes
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                12 Concepts Reference
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Complete theoretical foundations, architectural definitions, and viva Q&A for academic college evaluation.
            </p>
          </div>
        </div>
      </div>

      {/* 12 Topics Grid */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-emerald-400" />
          <h2 className="text-lg font-bold text-white">The 12 Core Blockchain Topics</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {concepts.map((c) => {
            const Icon = c.icon;
            return (
              <div
                key={c.num}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition space-y-3 shadow-md flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-teal-400 px-2 py-0.5 rounded bg-teal-500/10 border border-teal-500/20">
                      Concept #{c.num}
                    </span>
                    <Icon className="w-4 h-4 text-emerald-400" />
                  </div>
                  <h3 className="font-bold text-white text-sm">{c.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">
                    {c.definition}
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 leading-relaxed">
                  {c.details}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* College Viva Q&A Accordion */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-white">
              Faculty Viva Examination Q&A Preparation
            </h2>
          </div>
          <span className="text-xs text-slate-400">Frequently Asked Viva Questions</span>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-slate-800 bg-slate-950/60 overflow-hidden transition"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-3 text-xs font-bold text-white hover:bg-slate-900/60 transition"
                >
                  <span className="text-emerald-300">Q{idx + 1}: {faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="p-4 pt-0 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 bg-slate-950/90">
                    <strong className="text-teal-400">Model Answer: </strong>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
