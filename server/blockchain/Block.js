const crypto = require('crypto');
const MerkleTree = require('./MerkleTree');

/**
 * Block Class
 * Implements Topic 3 & 6: Reusable block structure with SHA-256 hashing and Proof of Work mining.
 */
class Block {
  constructor({
    index = 0,
    timestamp = Date.now(),
    data = 'Empty Block Data',
    transactions = [],
    previousHash = '0',
    nonce = 0,
    difficulty = 2,
    hash = null,
    merkleRoot = null,
    miningDurationMs = 0,
    attempts = 0
  }) {
    this.index = Number(index);
    this.timestamp = timestamp;
    this.data = data;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.nonce = Number(nonce);
    this.difficulty = Number(difficulty);

    // Compute Merkle Root for all block transactions
    this.merkleRoot = merkleRoot || MerkleTree.getRoot(this.transactions.length > 0 ? this.transactions : [this.data]);
    this.miningDurationMs = miningDurationMs;
    this.attempts = attempts;

    // Calculate initial hash or retain provided hash
    this.hash = hash || this.calculateHash();
  }

  /**
   * Topic 2 & 3: SHA-256 hash generation function.
   * Hashes index, previousHash, timestamp, block data/merkleRoot, and nonce.
   */
  calculateHash() {
    const content = `${this.index}${this.previousHash}${this.timestamp}${JSON.stringify(this.data)}${this.merkleRoot}${this.nonce}`;
    return crypto.createHash('sha256').update(content).digest('hex');
  }

  /**
   * Topic 6: Proof of Work (PoW) Mining.
   * Repeatedly increments nonce until hash begins with the required number of leading zeros.
   * Tracks nonce, total attempts, and duration in milliseconds.
   */
  mineBlock(difficulty = 2) {
    this.difficulty = Number(difficulty);
    const targetPrefix = '0'.repeat(this.difficulty);
    const startTime = Date.now();
    let attempts = 0;

    // Reset nonce before mining
    this.nonce = 0;
    this.hash = this.calculateHash();

    while (!this.hash.startsWith(targetPrefix)) {
      this.nonce++;
      attempts++;
      this.hash = this.calculateHash();

      // Safety guard for extreme test difficulties
      if (attempts > 5000000) {
        throw new Error('Mining safety threshold reached (5,000,000 attempts). Lower difficulty.');
      }
    }

    const duration = Date.now() - startTime;
    this.miningDurationMs = Math.max(duration, 1);
    this.attempts = attempts;

    return {
      index: this.index,
      nonce: this.nonce,
      attempts: this.attempts,
      durationMs: this.miningDurationMs,
      difficulty: this.difficulty,
      hash: this.hash,
      status: 'SUCCESS'
    };
  }

  /**
   * Validates internal cryptographic integrity of this single block.
   */
  hasValidHash() {
    return this.hash === this.calculateHash();
  }
}

module.exports = Block;
