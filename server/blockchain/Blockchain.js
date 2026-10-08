const Block = require('./Block');
const Transaction = require('./Transaction');
const MerkleTree = require('./MerkleTree');

/**
 * Blockchain Class
 * Implements Topic 4, 5, 6:
 * - Genesis block initialization
 * - Sequential block addition with cryptographic linkage
 * - Proof of Work mining with pending transactions
 * - Comprehensive multi-check chain validation
 * - Intentional block tampering simulator for educational demo
 */
class Blockchain {
  constructor(difficulty = 2) {
    this.chain = [];
    this.difficulty = Number(difficulty);
    this.pendingTransactions = [];
    this.miningReward = 50;
    this.isTampered = false;
    this.tamperedInfo = null;

    // Initialize Genesis Block
    this.chain.push(this.createGenesisBlock());
  }

  /**
   * Topic 4: Create Genesis Block (Block 0)
   */
  createGenesisBlock() {
    const genesisTx = new Transaction({
      id: 'TX-GENESIS-001',
      sender: 'GENESIS_ALLOCATION',
      receiver: 'ECO_ECOSYSTEM_TREASURY',
      amount: 100000,
      timestamp: 1711929600000, // Fixed genesis epoch
      type: 'GENESIS',
      details: 'Initial EcoCoin Genesis Token Allocation for Sustainable Maritime Network'
    });

    const genesisBlock = new Block({
      index: 0,
      timestamp: 1711929600000,
      data: 'Eco Chain Shipping Genesis Block – Immutable Maritime Ledger',
      transactions: [genesisTx],
      previousHash: '0',
      nonce: 0,
      difficulty: this.difficulty,
      miningDurationMs: 12,
      attempts: 1
    });

    // Ensure genesis block meets initial difficulty target or calculate its hash
    genesisBlock.mineBlock(this.difficulty);
    return genesisBlock;
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  /**
   * Topic 1 & 3: Dynamically creates and appends a single block with custom data
   */
  createCustomBlock(data, transactions = []) {
    const latest = this.getLatestBlock();
    const newBlock = new Block({
      index: this.chain.length,
      timestamp: Date.now(),
      data: data || `Manual Educational Block #${this.chain.length}`,
      transactions: transactions,
      previousHash: latest.hash,
      difficulty: this.difficulty
    });

    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
    return newBlock;
  }

  /**
   * Topic 8 & 9: Adds transaction to the pending transactions pool after validation
   */
  addTransaction(transaction, walletManager = null) {
    // Validate transaction structure and business rules
    const validation = transaction.validate(
      walletManager ? (addr) => walletManager.findWalletByAddress(addr) : null
    );

    if (!validation.isValid) {
      throw new Error(validation.message);
    }

    this.pendingTransactions.push(transaction);
    return {
      success: true,
      pendingCount: this.pendingTransactions.length,
      transaction
    };
  }

  /**
   * Topic 6: Mines pending transactions using Proof of Work
   * Creates a new block, computes Merkle root, mines with target difficulty,
   * clears pending transactions and creates a mining reward transaction.
   */
  minePendingTransactions(minerRewardAddress) {
    const latest = this.getLatestBlock();

    // Prepare transactions to include in this block
    const blockTransactions = [...this.pendingTransactions];

    // Build block
    const newBlock = new Block({
      index: this.chain.length,
      timestamp: Date.now(),
      data: `Mined Block containing ${blockTransactions.length} shipment/transfer transaction(s)`,
      transactions: blockTransactions,
      previousHash: latest.hash,
      difficulty: this.difficulty
    });

    // Run Proof of Work
    const miningResult = newBlock.mineBlock(this.difficulty);

    // Push new block to chain
    this.chain.push(newBlock);

    // Reset pending transactions and award mining reward to miner
    this.pendingTransactions = [
      new Transaction({
        sender: 'SYSTEM_MINT',
        receiver: minerRewardAddress || 'ECO_MINER_DEFAULT',
        amount: this.miningReward,
        type: 'MINING_REWARD',
        details: `PoW Mining Reward for Block #${newBlock.index}`
      })
    ];

    return {
      success: true,
      minedBlock: newBlock,
      miningResult,
      totalBlocks: this.chain.length
    };
  }

  /**
   * Topic 5: Comprehensive Blockchain Validation
   * Checks:
   * 1. Genesis block validity
   * 2. Recalculated hash matches current block hash
   * 3. Previous hash pointer matches prior block's hash
   * 4. Proof of Work difficulty constraint satisfied
   * 5. Merkle Root integrity of transactions
   */
  isChainValid() {
    const issues = [];

    // Check genesis block
    const genesis = this.chain[0];
    if (genesis.index !== 0 || genesis.previousHash !== '0') {
      issues.push({
        blockIndex: 0,
        type: 'GENESIS_CORRUPTED',
        message: 'Genesis block structure is corrupted (index != 0 or previousHash != "0").'
      });
    }

    // Check chain linkage and data integrity
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      // 1. Current hash validity (tamper detection)
      const calculatedHash = currentBlock.calculateHash();
      if (currentBlock.hash !== calculatedHash) {
        issues.push({
          blockIndex: i,
          type: 'HASH_TAMPERED',
          message: `Block #${i} has been tampered with! Stored hash (${currentBlock.hash.slice(0, 12)}...) does not match recalculated hash (${calculatedHash.slice(0, 12)}...).`
        });
      }

      // 2. Previous hash connection
      if (currentBlock.previousHash !== previousBlock.hash) {
        issues.push({
          blockIndex: i,
          type: 'LINK_BROKEN',
          message: `Broken chain link at Block #${i}! Previous hash (${currentBlock.previousHash.slice(0, 12)}...) does not match Block #${i - 1} hash (${previousBlock.hash.slice(0, 12)}...).`
        });
      }

      // 3. Merkle root integrity
      const expectedMerkleRoot = MerkleTree.getRoot(
        currentBlock.transactions.length > 0 ? currentBlock.transactions : [currentBlock.data]
      );
      if (currentBlock.merkleRoot !== expectedMerkleRoot) {
        issues.push({
          blockIndex: i,
          type: 'MERKLE_ROOT_MISMATCH',
          message: `Block #${i} Merkle Root is inconsistent with its underlying transaction data.`
        });
      }
    }

    const isValid = issues.length === 0;
    this.isTampered = !isValid;

    return {
      isValid,
      status: isValid ? 'Blockchain Valid' : 'Blockchain Invalid',
      totalBlocks: this.chain.length,
      issuesCount: issues.length,
      issues,
      failedBlockIndex: issues.length > 0 ? issues[0].blockIndex : null
    };
  }

  /**
   * Topic 5 Demo: Tamper with a block to demonstrate chain invalidation
   */
  tamperBlock(index, newPayload = 'TAMPERED: Illicit modification of shipment weight & fee') {
    const targetIndex = Number(index);
    if (targetIndex < 0 || targetIndex >= this.chain.length) {
      throw new Error(`Block index ${index} out of range (0 to ${this.chain.length - 1})`);
    }

    const block = this.chain[targetIndex];
    const originalData = block.data;

    // Mutate the block data without recalculating hash or next blocks
    block.data = newPayload;
    // Also modify transactions description if present
    if (block.transactions && block.transactions.length > 0) {
      block.transactions[0].details = 'TAMPERED: Altered Transaction Payload';
      block.transactions[0].amount = 999999;
    }

    this.isTampered = true;
    this.tamperedInfo = {
      blockIndex: targetIndex,
      originalData,
      tamperedData: newPayload,
      timestamp: new Date().toISOString()
    };

    return {
      success: true,
      message: `Block #${targetIndex} was intentionally tampered with. Check validation to observe the chain invalidation.`,
      tamperedBlockIndex: targetIndex
    };
  }

  /**
   * Topic 5 Demo: Re-mine / repair the chain from tampered block onward
   */
  repairChain() {
    // Re-compute hashes and re-mine from block 1 onwards
    for (let i = 1; i < this.chain.length; i++) {
      const current = this.chain[i];
      const previous = this.chain[i - 1];

      current.previousHash = previous.hash;
      current.merkleRoot = MerkleTree.getRoot(
        current.transactions.length > 0 ? current.transactions : [current.data]
      );
      current.mineBlock(this.difficulty);
    }

    this.isTampered = false;
    this.tamperedInfo = null;

    return {
      success: true,
      message: 'Blockchain cryptographically re-mined and repaired.',
      validation: this.isChainValid()
    };
  }
}

module.exports = Blockchain;
