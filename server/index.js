const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const path = require('path');

const Block = require('./blockchain/Block');
const Blockchain = require('./blockchain/Blockchain');
const Transaction = require('./blockchain/Transaction');
const MerkleTree = require('./blockchain/MerkleTree');
const SmartContract = require('./blockchain/SmartContract');
const WalletManager = require('./blockchain/WalletManager');
const ShipmentManager = require('./blockchain/ShipmentManager');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize Core Blockchain Components
let blockchain;
let smartContract;
let walletManager;
let shipmentManager;

function initializeSystem() {
  blockchain = new Blockchain(2); // Default difficulty = 2
  smartContract = new SmartContract();
  walletManager = new WalletManager();
  shipmentManager = new ShipmentManager(smartContract, blockchain, walletManager);

  // Seed Block 1: Delivery of ECO-SHP-101
  const tx1 = new Transaction({
    id: 'TX-SHP101-ESCROW',
    sender: '0x21D95A401C312061A028471822C05193B6109D78',
    receiver: 'ESCROW_CONTRACT',
    amount: 220,
    timestamp: Date.now() - 86400000 * 2,
    type: 'SHIPMENT_ESCROW',
    shipmentId: 'ECO-SHP-101',
    details: 'Escrow lock for Solar Panels shipment to Hamburg'
  });

  const tx2 = new Transaction({
    id: 'TX-SHP101-PAYOUT',
    sender: 'ESCROW_CONTRACT',
    receiver: '0x83BD6A329F1A42C7D1B998E204C61F92E3812B44',
    amount: 245, // 220 freight + 25 eco-bonus
    timestamp: Date.now() - 86400000 * 1,
    type: 'DELIVERY_RELEASE',
    shipmentId: 'ECO-SHP-101',
    details: 'Automated Smart Contract release upon verified green delivery + Eco Bonus'
  });

  blockchain.addTransaction(tx1);
  blockchain.addTransaction(tx2);
  blockchain.minePendingTransactions('0x1A88F3B9200109C482C318260D0429AA96B501A1');

  // Seed Block 2: In-transit shipment ECO-SHP-102
  const tx3 = new Transaction({
    id: 'TX-SHP102-ESCROW',
    sender: '0x21D95A401C312061A028471822C05193B6109D78',
    receiver: 'ESCROW_CONTRACT',
    amount: 380,
    timestamp: Date.now() - 43200000,
    type: 'SHIPMENT_ESCROW',
    shipmentId: 'ECO-SHP-102',
    details: 'Escrow lock for Fair-Trade Cocoa freight Santos -> Antwerp'
  });

  const tx4 = new Transaction({
    id: 'TX-COIN-TRANSFER-01',
    sender: '0x55E470129F9444B68140B51239A061C8B2945E99',
    receiver: '0x21D95A401C312061A028471822C05193B6109D78',
    amount: 150,
    timestamp: Date.now() - 21600000,
    type: 'STANDARD_TRANSFER',
    details: 'Packaging material deposit advance payment'
  });

  blockchain.addTransaction(tx3);
  blockchain.addTransaction(tx4);
  blockchain.minePendingTransactions('0x83BD6A329F1A42C7D1B998E204C61F92E3812B44');

  // Add 1 pending transaction in the pool to demonstrate pending states
  const pendingTx = new Transaction({
    id: 'TX-PENDING-DEMO',
    sender: '0x21D95A401C312061A028471822C05193B6109D78',
    receiver: 'ESCROW_CONTRACT',
    amount: 140,
    timestamp: Date.now() - 1800000,
    type: 'SHIPMENT_ESCROW',
    shipmentId: 'ECO-SHP-103',
    details: 'Escrow lock awaiting miner inclusion for Recycled Plastics'
  });
  blockchain.pendingTransactions.push(pendingTx);
}

// Initial boot
initializeSystem();

// ==========================================
// REST API ROUTES
// ==========================================

/**
 * 0. System Overall Status (Dashboard KPIs)
 */
app.get('/api/status', (req, res) => {
  const shipments = shipmentManager.getAllShipments();
  const activeShipments = shipments.filter((s) => s.status !== 'Delivered').length;
  const deliveredShipments = shipments.filter((s) => s.status === 'Delivered').length;

  let totalConfirmedTxs = 0;
  blockchain.chain.forEach((b) => {
    if (b.transactions) totalConfirmedTxs += b.transactions.length;
  });

  const totalCarbonSavedKg = shipments.reduce((acc, s) => acc + (s.carbonSavedKg || 0), 0);
  const validation = blockchain.isChainValid();

  res.json({
    appName: 'Eco Chain Shipping',
    version: '1.0.0',
    totalBlocks: blockchain.chain.length,
    totalTransactions: totalConfirmedTxs + blockchain.pendingTransactions.length,
    confirmedTransactions: totalConfirmedTxs,
    pendingTransactionsCount: blockchain.pendingTransactions.length,
    activeShipments,
    deliveredShipments,
    totalShipments: shipments.length,
    totalWallets: walletManager.getAllWallets().length,
    blockchainStatus: validation.status,
    isChainValid: validation.isValid,
    difficulty: blockchain.difficulty,
    latestBlockHash: blockchain.getLatestBlock().hash,
    latestBlockIndex: blockchain.getLatestBlock().index,
    escrowBalance: smartContract.escrowBalance,
    totalCarbonSavedKg,
    isTampered: blockchain.isTampered
  });
});

/**
 * 1. Hello Blockchain / 3. Simple Block / 4. Blockchain Overview
 */
app.get('/api/blockchain', (req, res) => {
  const validation = blockchain.isChainValid();
  res.json({
    chain: blockchain.chain,
    difficulty: blockchain.difficulty,
    pendingTransactions: blockchain.pendingTransactions,
    miningReward: blockchain.miningReward,
    validation,
    isTampered: blockchain.isTampered,
    tamperedInfo: blockchain.tamperedInfo
  });
});

/**
 * Topic 1 & 3: Create Block dynamically
 */
app.post('/api/blockchain/create-block', (req, res) => {
  try {
    const { data, transactions } = req.body;
    const newBlock = blockchain.createCustomBlock(data, transactions || []);
    res.json({
      success: true,
      message: `Block #${newBlock.index} created dynamically and appended to blockchain!`,
      block: newBlock,
      validation: blockchain.isChainValid()
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

/**
 * Topic 2: Hash Generation & Avalanche Effect Sandbox
 */
app.post('/api/hash', (req, res) => {
  const { input = '', compareWith = '' } = req.body;
  const hash = crypto.createHash('sha256').update(input).digest('hex');

  let comparison = null;
  if (compareWith !== undefined && compareWith !== '') {
    const compareHash = crypto.createHash('sha256').update(compareWith).digest('hex');
    let differingChars = 0;
    for (let i = 0; i < 64; i++) {
      if (hash[i] !== compareHash[i]) differingChars++;
    }
    comparison = {
      compareWith,
      compareHash,
      differingChars,
      differingPercentage: ((differingChars / 64) * 100).toFixed(1) + '%'
    };
  }

  res.json({
    input,
    hash,
    length: hash.length,
    algorithm: 'SHA-256',
    comparison
  });
});

/**
 * Topic 5: Validate Blockchain
 */
app.get('/api/blockchain/validate', (req, res) => {
  const validation = blockchain.isChainValid();
  res.json(validation);
});

/**
 * Topic 5: Tamper Block Demonstration
 */
app.post('/api/blockchain/tamper', (req, res) => {
  try {
    const { blockIndex, tamperedData } = req.body;
    const result = blockchain.tamperBlock(blockIndex, tamperedData);
    const validation = blockchain.isChainValid();
    res.json({
      ...result,
      validation
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

/**
 * Topic 5: Repair / Re-mine Tampered Chain
 */
app.post('/api/blockchain/repair', (req, res) => {
  try {
    const result = blockchain.repairChain();
    res.json(result);
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

/**
 * Topic 6: Proof of Work Mining
 */
app.post('/api/mining/mine', (req, res) => {
  try {
    const { minerAddress, difficulty } = req.body;

    if (difficulty !== undefined) {
      blockchain.difficulty = Math.max(1, Math.min(5, Number(difficulty)));
    }

    const miner = minerAddress || '0x1A88F3B9200109C482C318260D0429AA96B501A1';
    const result = blockchain.minePendingTransactions(miner);

    res.json({
      ...result,
      validation: blockchain.isChainValid()
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.post('/api/mining/difficulty', (req, res) => {
  const { difficulty } = req.body;
  blockchain.difficulty = Math.max(1, Math.min(5, Number(difficulty)));
  res.json({ success: true, difficulty: blockchain.difficulty });
});

/**
 * Topic 7: Wallets
 */
app.get('/api/wallets', (req, res) => {
  res.json(walletManager.getAllWallets());
});

app.post('/api/wallets', (req, res) => {
  try {
    const { name, role, balance } = req.body;
    if (!name) return res.status(400).json({ error: 'Wallet name is required.' });
    const newWallet = walletManager.createWallet({ name, role, balance });
    res.json({ success: true, wallet: newWallet });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

/**
 * Topic 8 & 9: Transactions & Transaction Validation
 */
app.get('/api/transactions', (req, res) => {
  const confirmed = [];
  blockchain.chain.forEach((block) => {
    if (block.transactions) {
      block.transactions.forEach((tx) => {
        confirmed.push({ ...tx, blockIndex: block.index, blockHash: block.hash });
      });
    }
  });

  res.json({
    pending: blockchain.pendingTransactions,
    confirmed,
    totalConfirmed: confirmed.length,
    totalPending: blockchain.pendingTransactions.length
  });
});

app.post('/api/transactions', (req, res) => {
  try {
    const { sender, receiver, amount, type, shipmentId, details } = req.body;
    const tx = new Transaction({
      sender,
      receiver,
      amount: Number(amount),
      type: type || 'STANDARD_TRANSFER',
      shipmentId,
      details
    });

    const result = blockchain.addTransaction(tx, walletManager);

    // Deduct and credit balances in walletManager
    if (sender !== 'SYSTEM_MINT' && sender !== 'GENESIS_ALLOCATION') {
      walletManager.transferDirect(sender, receiver, Number(amount));
    }

    res.json({
      success: true,
      message: 'Transaction successfully validated and added to pending pool!',
      transaction: tx,
      pendingCount: blockchain.pendingTransactions.length
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

/**
 * Topic 9: Standalone Transaction Validation Test Endpoint
 */
app.post('/api/transactions/validate', (req, res) => {
  const { sender, receiver, amount } = req.body;
  const tempTx = new Transaction({
    sender: sender || '',
    receiver: receiver || '',
    amount: Number(amount) || 0
  });

  const validation = tempTx.validate((addr) => walletManager.findWalletByAddress(addr));

  // Build granular rule checklist for UI
  const senderWallet = walletManager.findWalletByAddress(sender);
  const receiverWallet = walletManager.findWalletByAddress(receiver);

  const checklist = [
    {
      rule: 'Sender exists in ledger',
      passed: Boolean(senderWallet || sender === 'SYSTEM_MINT'),
      details: senderWallet ? `Found: ${senderWallet.name}` : 'Sender not found'
    },
    {
      rule: 'Receiver exists in ledger',
      passed: Boolean(receiverWallet),
      details: receiverWallet ? `Found: ${receiverWallet.name}` : 'Receiver not found'
    },
    {
      rule: 'Amount is greater than zero',
      passed: Number(amount) > 0,
      details: `Amount: ${amount} EcoCoins`
    },
    {
      rule: 'Sender and receiver are different',
      passed: sender !== receiver && Boolean(sender) && Boolean(receiver),
      details: sender === receiver ? 'Sender and receiver are identical!' : 'Distinct addresses'
    },
    {
      rule: 'Sender has sufficient balance',
      passed: Boolean(senderWallet && senderWallet.balance >= Number(amount)),
      details: senderWallet ? `Balance: ${senderWallet.balance} ECO (Requires: ${amount})` : 'N/A'
    }
  ];

  res.json({
    isValid: validation.isValid,
    message: validation.message,
    checklist
  });
});

/**
 * Topic 10: Merkle Tree Generation & Visual Hierarchy
 */
app.post('/api/merkle/generate', (req, res) => {
  const { items } = req.body;
  const list = items && items.length > 0 ? items : [
    'Tx A: 100 ECO to Carrier 1',
    'Tx B: 250 ECO to Carrier 2',
    'Tx C: 50 ECO Carbon Offset',
    'Tx D: 180 ECO Escrow Lock'
  ];

  const tree = MerkleTree.buildTree(list);
  res.json(tree);
});

app.get('/api/merkle/block/:index', (req, res) => {
  const idx = Number(req.params.index);
  if (idx < 0 || idx >= blockchain.chain.length) {
    return res.status(404).json({ error: 'Block not found' });
  }

  const block = blockchain.chain[idx];
  const items = block.transactions && block.transactions.length > 0 ? block.transactions : [block.data];
  const tree = MerkleTree.buildTree(items);

  res.json({
    blockIndex: block.index,
    blockHash: block.hash,
    storedMerkleRoot: block.merkleRoot,
    computedTree: tree,
    matches: block.merkleRoot === tree.root
  });
});

/**
 * Shipments & Topic 11: Smart Contract Simulation
 */
app.get('/api/shipments', (req, res) => {
  res.json(shipmentManager.getAllShipments());
});

app.post('/api/shipments', (req, res) => {
  try {
    const shipment = shipmentManager.createShipment(req.body);

    // Create a transaction on blockchain for the escrow creation
    const escrowTx = new Transaction({
      sender: shipment.sender,
      receiver: 'ESCROW_CONTRACT',
      amount: shipment.escrowAmount,
      type: 'SHIPMENT_ESCROW',
      shipmentId: shipment.id,
      details: `Escrow registered for ${shipment.title}`
    });
    blockchain.pendingTransactions.push(escrowTx);

    res.json({
      success: true,
      shipment,
      pendingTx: escrowTx
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.post('/api/shipments/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { nextStatus, note } = req.body;

    const result = shipmentManager.updateShipmentStatus(id, nextStatus, note);

    // If delivered, automatically record payout tx in pending transactions!
    if (nextStatus === 'Delivered') {
      const payoutTx = new Transaction({
        sender: 'ESCROW_CONTRACT',
        receiver: result.shipment.carrier,
        amount: result.transitionResult.releasedPayout,
        type: 'DELIVERY_RELEASE',
        shipmentId: result.shipment.id,
        details: `Smart contract payout released for delivered shipment ${result.shipment.id} (+ Eco-Bonus)`
      });
      blockchain.pendingTransactions.push(payoutTx);
    }

    res.json({
      success: true,
      ...result,
      pendingTransactionsCount: blockchain.pendingTransactions.length
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

/**
 * Topic 11: Smart Contract Details and Execution Logs
 */
app.get('/api/smart-contract', (req, res) => {
  res.json({
    contractName: smartContract.contractName,
    escrowBalance: smartContract.escrowBalance,
    escrows: Array.from(smartContract.escrows.values()),
    logs: smartContract.executionLogs,
    rules: [
      {
        id: 1,
        title: 'Shipment Creation & Escrow',
        description: 'Shipment begins in "Pending" status and freight fee is locked in contract escrow.'
      },
      {
        id: 2,
        title: 'Carrier Verification',
        description: 'Shipment must be assigned to an authorized carrier before moving to "Picked Up".'
      },
      {
        id: 3,
        title: 'Ordered State Progression',
        description: 'States must transition in sequence: Pending -> Picked Up -> In Transit -> Delivered. Skipping or reverting states is rejected.'
      },
      {
        id: 4,
        title: 'Automated Payout Release',
        description: 'Freight payment is released from escrow to the carrier ONLY when status reaches "Delivered".'
      },
      {
        id: 5,
        title: 'Sustainability Eco-Bonus',
        description: 'If Eco Score >= 80, an extra sustainability reward (+25 EcoCoins) is automatically minted and awarded to the carrier.'
      }
    ]
  });
});

/**
 * Topic 12: Mini Blockchain Explorer Search
 */
app.get('/api/explorer/search', (req, res) => {
  const query = (req.query.q || '').trim();
  if (!query) return res.json({ results: [] });

  const results = [];

  // Search by block index
  if (!isNaN(query)) {
    const idx = Number(query);
    if (idx >= 0 && idx < blockchain.chain.length) {
      results.push({
        type: 'BLOCK',
        title: `Block #${idx}`,
        data: blockchain.chain[idx]
      });
    }
  }

  // Search by block hash
  blockchain.chain.forEach((block) => {
    if (block.hash.toLowerCase().includes(query.toLowerCase())) {
      results.push({
        type: 'BLOCK',
        title: `Block #${block.index}`,
        data: block
      });
    }
  });

  // Search by transaction ID
  blockchain.chain.forEach((block) => {
    if (block.transactions) {
      block.transactions.forEach((tx) => {
        if (tx.id.toLowerCase().includes(query.toLowerCase()) ||
            tx.sender.toLowerCase().includes(query.toLowerCase()) ||
            tx.receiver.toLowerCase().includes(query.toLowerCase())) {
          results.push({
            type: 'TRANSACTION',
            title: `Transaction ${tx.id}`,
            data: { ...tx, blockIndex: block.index, blockHash: block.hash }
          });
        }
      });
    }
  });

  // Search pending transactions
  blockchain.pendingTransactions.forEach((tx) => {
    if (tx.id.toLowerCase().includes(query.toLowerCase())) {
      results.push({
        type: 'TRANSACTION (PENDING)',
        title: `Pending Transaction ${tx.id}`,
        data: tx
      });
    }
  });

  // Search by shipment ID
  const shipment = shipmentManager.getShipmentById(query.toUpperCase());
  if (shipment) {
    results.push({
      type: 'SHIPMENT',
      title: `Shipment ${shipment.id}`,
      data: shipment
    });
  }

  res.json({ query, resultsCount: results.length, results });
});

/**
 * Reset system to initial pristine demo state
 */
app.post('/api/reset', (req, res) => {
  initializeSystem();
  res.json({ success: true, message: 'System reset to initial sample state.' });
});

// Serve frontend in production build if present
const clientDist = path.join(__dirname, '../client/dist');
app.use(express.static(clientDist));
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api')) {
    return res.sendFile(path.join(clientDist, 'index.html'), (err) => {
      if (err) res.status(404).send('Eco Chain Shipping Backend API is running.');
    });
  }
  next();
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`  Eco Chain Shipping - Blockchain Management System  `);
  console.log(`  Backend Server running on http://localhost:${PORT} `);
  console.log(`=======================================================`);
});
