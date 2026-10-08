const crypto = require('crypto');

/**
 * Wallet Class
 * Academic simulation of a cryptographic wallet for Eco Chain Shipping.
 * Simulated keys are clearly marked for academic demonstration purposes.
 */
class Wallet {
  constructor({
    id = null,
    name = 'Unnamed Shipping Entity',
    role = 'CARRIER',
    balance = 1000,
    address = null,
    privateKey = null
  }) {
    this.id = id || `WAL-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
    this.name = name;
    this.role = role; // SHIPPER, CARRIER, RECEIVER, REGULATOR, ADMIN
    this.balance = Number(balance);

    // Cryptographically generated demo address (public key hash)
    const randomSeed = crypto.randomBytes(16).toString('hex');
    this.address = address || '0x' + crypto.createHash('sha256').update(this.name + randomSeed).digest('hex').substring(0, 40);

    // Explicitly labeled academic demonstration private key
    this.privateKey = privateKey || 'DEMO_SEC_KEY_' + crypto.randomBytes(24).toString('hex');
    this.createdAt = new Date().toISOString();
  }

  /**
   * Safe representation for UI / API (omitting raw private keys or labeling them clearly)
   */
  toJSON(includePrivateKey = true) {
    return {
      id: this.id,
      name: this.name,
      role: this.role,
      balance: this.balance,
      address: this.address,
      privateKey: includePrivateKey ? this.privateKey : '[PROTECTED]',
      isAcademicSimulation: true,
      createdAt: this.createdAt
    };
  }
}

module.exports = Wallet;
