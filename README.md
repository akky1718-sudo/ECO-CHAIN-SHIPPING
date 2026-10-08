# Eco Chain Shipping – Blockchain-Based Sustainable Shipping Management System

> **Academic Mini-Project & College Demonstration Edition**  
> *A full-stack, fully operational, educational blockchain application for sustainable maritime and freight logistics.*

---

## 📖 Executive Summary & Project Idea

**Eco Chain Shipping** is an educational blockchain management platform engineered to demonstrate core blockchain architectures, consensus mechanisms, and smart contract automation through a practical, real-world logistics application.

In traditional maritime shipping, cargo manifests, bills of lading, environmental emission records, and carrier payments are vulnerable to centralized tampering, invoice disputes, and fraudulent greenwashing. **Eco Chain Shipping** solves this by storing shipment states and freight payments on an immutable, custom-built educational blockchain:
- Every critical logistics milestone (`Pending` → `Picked Up` → `In Transit` → `Delivered`) is recorded as a cryptographically signed transaction.
- Carrier freight funds are secured in an autonomous **Smart Contract Escrow Vault**.
- Payments and sustainability bonuses are programmatically disbursed upon verified delivery.
- Proof of Work (PoW) consensus secures the chain against tampering.
- A visual **Merkle Tree** summarizes block transactions in $O(\log N)$ tamper-evident hierarchy.
- A dedicated **Faculty Guided Tour** and **Tamper Lab** make college presentations and viva examinations intuitive and interactive.

> **Safety Notice**: This project uses **purely simulated keys, addresses, and EcoCoin tokens** for academic demonstration. No real cryptocurrency, external networks, or real payment systems are involved.

---

## 🏆 Implementation of the 12 Required Blockchain Concepts

Every single one of the 12 topics is **genuinely implemented and interactive** with real algorithms—not static dummy buttons:

| # | Concept | Real Implementation in Eco Chain Shipping | UI Location |
|---|---|---|---|
| **1** | **Hello Blockchain** | Explains blockchain concepts; displays Genesis block and interactive block structures (Index, Timestamp, Data, Previous Hash, Hash, Nonce). | *Blockchain Ledger* & *Demo Tour (Step 2)* |
| **2** | **Hash Generation** | Live SHA-256 algorithm with interactive avalanche simulator. Demonstrates how changing 1 single letter flips ~50% of the 64 hex characters. | *SHA-256 Sandbox* & *Demo Tour (Step 1)* |
| **3** | **Simple Block Class Creation** | Object-Oriented `Block` class in `server/blockchain/Block.js` containing `index`, `timestamp`, `data`, `previousHash`, `hash`, `nonce`, and `merkleRoot`. | *Blockchain Ledger* & *All Blocks* |
| **4** | **Create Blockchain** | Object-Oriented `Blockchain` class (`server/blockchain/Blockchain.js`) that creates Genesis Block #0 (`previousHash = "0"`) and links each block sequentially. | *Blockchain Ledger* & *Dashboard* |
| **5** | **Validate Blockchain** | Multi-rule validation algorithm detecting hash recalculation mismatches, broken `previousHash` links, and Merkle root tampering. Includes interactive **Tamper Lab** and cryptographic **Self-Healing Re-Miner**. | *Blockchain Ledger* & *Navbar* |
| **6** | **Proof of Work (Mining)** | Configurable mining difficulty (1 to 5 leading zeros: `00...`). Real-time loop incrementing nonce, tracking attempts, execution time in ms, and awarding 50 EcoCoins mining incentive. | *PoW Mining Lab* & *Demo Tour (Step 7)* |
| **7** | **Simple Wallet** | Asymmetric key simulation generating Public Keys (`0x...`), clearly labeled academic demo Private Keys (`DEMO_KEY_...`), and balances in EcoCoins. Includes dynamic wallet creation modal. | *Wallets & Keys* |
| **8** | **Basic Transaction** | Structured peer-to-peer transfers between wallets (`id`, `sender`, `receiver`, `amount`, `timestamp`, `type`, `signature`). Queued in the unconfirmed mempool prior to block inclusion. | *Transactions* & *Mempool* |
| **9** | **Transaction Validation** | Comprehensive 5-rule dry-run validator verifying: (1) Sender exists, (2) Receiver exists, (3) Amount > 0, (4) Sender has sufficient balance, (5) Sender ≠ Receiver. | *Transactions Validator* |
| **10** | **Merkle Tree (Basic)** | Binary hash tree combining pairwise transactions with SHA-256. Handles odd-number leaf counts by duplicating the last node. Full interactive visual hierarchy from leaves to Merkle Root. | *Merkle Tree Visualizer* |
| **11** | **Smart Contract Simulation** | `EcoShippingContract_v1.0` state machine enforcing strict milestone ordering (`Pending` → `Picked Up` → `In Transit` → `Delivered`), escrow locks, and automatic payout + sustainability bonus (+25 ECO) release upon delivery. Rejects illegal skips. | *Smart Contract* & *Shipments* |
| **12** | **Mini Blockchain Explorer** | Real-time search engine and deep block inspector. Search by Block Index, Block Hash, Transaction ID, or Shipment ID with raw JSON audit views. | *Chain Explorer* |

---

## 🛠️ Technology Stack & Architecture

- **Backend**:
  - **Runtime**: Node.js (ES6 / CommonJS)
  - **Web Framework**: Express.js REST API
  - **Cryptography**: Node.js `crypto` module (SHA-256)
  - **Architecture**: Modular OOP design (`Block`, `Blockchain`, `Transaction`, `Wallet`, `WalletManager`, `MerkleTree`, `SmartContract`, `ShipmentManager`)
- **Frontend**:
  - **Framework**: React 19 (Single Page Application)
  - **Build Tool**: Vite
  - **Styling**: Tailwind CSS v4 (Emerald / Teal / Slate dark theme)
  - **Icons**: Lucide React
- **Testing**:
  - Standalone automated test suite: `tests/blockchain.test.js` (40/40 assertions passed)

```
Eco Chain Shipping Architecture:

  ┌────────────────────────────────────────────────────────┐
  │                   React + Vite UI                      │
  │  (Dashboard, Shipments, Chain, Mining, Explorer, etc.)  │
  └───────────────────────────┬────────────────────────────┘
                              │ REST APIs (/api/*)
  ┌───────────────────────────▼────────────────────────────┐
  │                 Express.js Backend                     │
  ├────────────────────────────────────────────────────────┤
  │  ShipmentManager       SmartContract       WalletMgr   │
  │  (Logistics State)    (Escrow Rules)      (Balances)   │
  ├────────────────────────────────────────────────────────┤
  │                      Blockchain                        │
  │    ┌──────────────────────────────────────────────┐    │
  │    │  Chain: [Block 0] ➔ [Block 1] ➔ [Block 2]... │    │
  │    │  Mempool: [Pending Transactions Pool]        │    │
  │    │  Consensus: Proof-of-Work (PoW) Mining       │    │
  │    │  MerkleTree: Pairwise SHA-256 Aggregation    │    │
  │    │  Validation: Full Cryptographic Integrity    │    │
  │    └──────────────────────────────────────────────┘    │
  └────────────────────────────────────────────────────────┘
```

---

## 🚀 How to Run the Project

### Option A: Quick Single-Command Launch (Recommended)

1. Open a terminal in the project directory:
   ```bash
   cd "Eco chain shipping"
   ```
2. Start the unified server:
   ```bash
   npm start
   ```
   *(Or `node server/index.js`)*
3. Open your browser and navigate to:
   ```
   http://localhost:5000
   ```
   The backend automatically serves both the **REST API** and the **built React frontend** on port 5000!

---

### Option B: Running Frontend & Backend in Development Mode

If you wish to develop or modify the frontend with live hot-reloading:

1. **Terminal 1 (Backend Server)**:
   ```bash
   npm run server
   ```
   *Runs Express API on `http://localhost:5000`*

2. **Terminal 2 (React Vite Client)**:
   ```bash
   npm run client
   ```
   *Runs Vite Dev Server on `http://localhost:3000` with automated proxy to backend*

3. **Or run both simultaneously with concurrently**:
   ```bash
   npm run dev
   ```

---

### Option C: Running the Automated Blockchain Tests

Verify that all 12 blockchain concepts pass all cryptographic assertions:
```bash
npm test
```
*(Or `node tests/blockchain.test.js`)*

Expected output:
```
====================================================
  TESTING ALL 12 BLOCKCHAIN CONCEPTS IN ECO CHAIN   
====================================================

--- 1 & 3. Hello Blockchain & Block Class ---
[PASS] Block index is 1
[PASS] Previous hash stored accurately
[PASS] Current hash is valid 64-char SHA-256
[PASS] Initial nonce is 0

--- 2. Hash Generation & Avalanche Effect ---
[PASS] Changing 1 single character changed the SHA-256 hash completely
[PASS] Avalanche effect verified: 62/64 characters differed (96.9%)

--- 4. Create Blockchain ---
[PASS] Blockchain initialized with Genesis Block
...
====================================================
  ALL TESTS PASSED: 40/40 tests succeeded!
====================================================
```

---

## 📋 REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/status` | System overview KPIs (total blocks, txs, shipments, blockchain validity, etc.) |
| `GET` | `/api/blockchain` | Full blockchain ledger, difficulty, pending transactions, and validation status |
| `POST` | `/api/blockchain/create-block` | Dynamically instantiates and appends a block with custom data |
| `GET` | `/api/blockchain/validate` | Runs full multi-check validation on the chain |
| `POST` | `/api/blockchain/tamper` | Simulates malicious tampering on a selected block |
| `POST` | `/api/blockchain/repair` | Re-mines and restores cryptographic validity of the chain |
| `POST` | `/api/mining/mine` | Mines pending mempool transactions with configurable PoW difficulty |
| `POST` | `/api/mining/difficulty` | Sets PoW target difficulty (1 to 5 leading zeros) |
| `POST` | `/api/hash` | Computes SHA-256 digest and performs avalanche differential analysis |
| `GET` | `/api/wallets` | Returns all registered participant wallets and simulated balances |
| `POST` | `/api/wallets` | Generates a new demo wallet with public/private keys |
| `GET` | `/api/transactions` | Retrieves pending transactions and confirmed blockchain transactions |
| `POST` | `/api/transactions` | Submits a new transaction through the 5-rule validator |
| `POST` | `/api/transactions/validate` | Dry-run validator returning itemized checklist breakdown |
| `POST` | `/api/merkle/generate` | Builds a Merkle Tree from an array of transactions, handling odd leaf counts |
| `GET` | `/api/merkle/block/:index` | Returns the visual Merkle Tree for a specific block |
| `GET` | `/api/shipments` | Retrieves all registered eco-shipments |
| `POST` | `/api/shipments` | Registers a shipment, locks escrow, and creates a mempool transaction |
| `POST` | `/api/shipments/:id/status` | Advances shipment status via Smart Contract rules and releases payout |
| `GET` | `/api/smart-contract` | Returns smart contract rules, active escrows, and execution logs |
| `GET` | `/api/explorer/search` | Queries blocks by index/hash or transactions by ID |
| `POST` | `/api/reset` | Resets the system to pristine initial seed state |

---

## 🎓 Faculty Presentation & Viva Guide

Use the built-in **"Faculty Demo Tour"** button in the navbar to guide an examiner through the project step-by-step:

1. **Step 1: Hash Generation & Avalanche Effect**
   - *Demonstrate*: Open the SHA-256 sandbox. Show that modifying 1 character in cargo description changes 62 of 64 hex characters (Avalanche Effect).
   - *Viva Explanation*: Cryptographic hashes are one-way, deterministic, and pre-image resistant.
2. **Step 2: Simple Block Structure**
   - *Demonstrate*: Create a dynamic block. Point out `index`, `timestamp`, `data`, `previousHash`, `hash`, and `nonce`.
3. **Step 3: Genesis Block & Blockchain Linkage**
   - *Demonstrate*: Show Block 0 (`previousHash = "0"`). Show how Block 1 contains `previousHash = Block[0].hash`.
4. **Step 4: Sustainable Shipments & Eco Score**
   - *Demonstrate*: Create a new shipment. Highlight environmental metrics (CO2 offset, eco score, freight escrow).
5. **Step 5: Value Transactions & Mempool**
   - *Demonstrate*: Transfer EcoCoins between wallets. Explain why transactions first sit in the unconfirmed Mempool.
6. **Step 6: Transaction Validation Rules**
   - *Demonstrate*: Show the 5-rule inspector preventing negative transfers, non-existent senders, or double-spending.
7. **Step 7: Proof of Work (PoW) Mining**
   - *Demonstrate*: Adjust difficulty to 3 zeros. Click "Mine Block Now". Show the nonce attempts, elapsed time, and the +50 EcoCoins reward credited to the miner.
8. **Step 8: Merkle Tree & Odd Leaf Duplication**
   - *Demonstrate*: Show how 3 transactions duplicate the 3rd leaf to build a balanced binary tree up to the Merkle Root.
9. **Step 9: Tamper Lab & Chain Invalidation**
   - *Demonstrate*: Tamper with Block #1 data. Watch the entire chain immediately flag as **"Blockchain Invalid"** with red diagnostics! Then click "Repair Chain" to demonstrate self-healing.
10. **Step 10: Smart Contract Autonomous Escrow**
    - *Demonstrate*: Try skipping a shipment from `Pending` directly to `Delivered`. Show the Smart Contract rejecting it with `Contract Rule Violation`. Then advance it through `Picked Up` → `In Transit` → `Delivered`, and watch the escrow and +25 ECO eco-bonus disburse automatically!
11. **Step 11: Blockchain Explorer**
    - *Demonstrate*: Search for a block by index or a transaction by ID. Inspect raw cryptographic metadata.
12. **Step 12: Viva Review**
    - *Demonstrate*: Review the FAQ section in the "Concepts & Viva Prep" page.

---

## 📦 Project File Structure

```
Eco chain shipping/
├── package.json                   # Root package configuration & npm scripts
├── README.md                      # Academic documentation & viva guide
├── tests/
│   └── blockchain.test.js         # Automated 40-assertion test suite for all 12 concepts
├── server/
│   ├── index.js                   # Express REST API server & static frontend host
│   └── blockchain/
│       ├── Block.js               # Topic 1, 3, 6: Block model with PoW mining
│       ├── Blockchain.js          # Topic 4, 5: Chain ledger, validation, tamper lab
│       ├── Transaction.js         # Topic 8, 9: Transaction model & 5-rule validation
│       ├── Wallet.js              # Topic 7: Academic wallet with simulated keys
│       ├── WalletManager.js       # Topic 7: Account balances and entity ledger
│       ├── MerkleTree.js          # Topic 10: Pairwise hashing & odd leaf duplication
│       ├── SmartContract.js       # Topic 11: EcoShippingContract state machine & escrow
│       └── ShipmentManager.js     # Sustainable logistics management
└── client/
    ├── package.json               # Frontend dependencies (React, Vite, Tailwind v4)
    ├── vite.config.js             # Vite configuration with API proxy to port 5000
    ├── index.html                 # Main HTML entrypoint with Plus Jakarta Sans & JetBrains Mono
    └── src/
        ├── main.jsx               # React entrypoint
        ├── index.css              # Tailwind CSS imports & animations
        ├── api.js                 # Centralized REST API client
        ├── App.jsx                # Root app container & global state polling
        ├── components/
        │   ├── Navbar.jsx         # Status badge, height pill, reset action
        │   └── Sidebar.jsx        # Navigation menu with topic badges
        └── pages/
            ├── DashboardPage.jsx      # System KPIs, active shipments, carbon savings
            ├── ShipmentsPage.jsx      # Cargo tracking pipeline & create modal
            ├── BlockchainPage.jsx     # Visual chain, block creator & tamper lab
            ├── MiningPage.jsx         # PoW mining lab with difficulty controls
            ├── WalletsPage.jsx        # Simulated keys, addresses & balances
            ├── TransactionsPage.jsx   # Transfer form & 5-rule real-time validator
            ├── MerkleTreePage.jsx     # Interactive visual Merkle Tree & sandbox
            ├── SmartContractPage.jsx  # Contract state machine & audit logs
            ├── ExplorerPage.jsx       # Public block & transaction search inspector
            ├── HashGeneratorPage.jsx  # Real-time SHA-256 & avalanche simulator
            ├── DemoGuidePage.jsx      # 12-step guided faculty presentation tour
            └── AboutBlockchainPage.jsx# Academic concepts guide & viva FAQs
```

---

## 🛡️ License & Academic Integrity

This project is prepared for educational and college demonstration purposes. All student and faculty presentations are encouraged to run the interactive demo and refer to the academic references provided within the application.
