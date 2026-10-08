const crypto = require('crypto');

/**
 * Transaction Class
 * Represents an EcoCoin value transfer or smart contract state event.
 */
class Transaction {
  constructor({
    id = null,
    sender,
    receiver,
    amount,
    timestamp = Date.now(),
    type = 'STANDARD_TRANSFER',
    shipmentId = null,
    details = '',
    signature = null
  }) {
    this.id = id || `TX-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    this.sender = sender;
    this.receiver = receiver;
    this.amount = Number(amount);
    this.timestamp = timestamp;
    this.type = type; // STANDARD_TRANSFER, SHIPMENT_ESCROW, DELIVERY_RELEASE, ECO_BONUS, MINING_REWARD, GENESIS
    this.shipmentId = shipmentId;
    this.details = details || `${this.type} of ${this.amount} EcoCoins`;
    this.signature = signature || this.generateSimulatedSignature();
  }

  /**
   * Generates SHA-256 hash representing the transaction content
   */
  calculateHash() {
    return crypto
      .createHash('sha256')
      .update(this.sender + this.receiver + this.amount + this.timestamp + (this.shipmentId || ''))
      .digest('hex');
  }

  /**
   * Generates simulated cryptographic signature for academic demonstration
   */
  generateSimulatedSignature() {
    const raw = `${this.sender}:${this.calculateHash()}`;
    return 'SIG_DEMO_' + crypto.createHash('sha256').update(raw).digest('hex').slice(0, 32);
  }

  /**
   * Validates transaction structure and rules according to Topic 9:
   * - Sender exists
   * - Receiver exists
   * - Amount > 0
   * - Sender and receiver are different
   * - Valid structure
   * - Sender has sufficient balance (checked against walletLookup callback if provided)
   */
  validate(walletLookup = null) {
    // 1. Structure check
    if (!this.id) {
      return { isValid: false, message: 'Invalid transaction: Missing Transaction ID.' };
    }
    if (!this.sender || typeof this.sender !== 'string' || this.sender.trim() === '') {
      return { isValid: false, message: 'Validation Failed: Sender address cannot be empty.' };
    }
    if (!this.receiver || typeof this.receiver !== 'string' || this.receiver.trim() === '') {
      return { isValid: false, message: 'Validation Failed: Receiver address cannot be empty.' };
    }

    // Special system transactions: MINING_REWARD and GENESIS do not require standard sender balances
    if (this.sender === 'SYSTEM_MINT' || this.sender === 'GENESIS_ALLOCATION') {
      if (this.amount < 0) {
        return { isValid: false, message: 'Validation Failed: Reward amount cannot be negative.' };
      }
      return { isValid: true, message: 'Valid system transaction (Mining Reward / Genesis Allocation).' };
    }

    // 2. Sender and receiver are different
    if (this.sender === this.receiver) {
      return {
        isValid: false,
        message: 'Validation Failed: Sender and Receiver addresses must be different.'
      };
    }

    // 3. Amount is greater than zero
    if (isNaN(this.amount) || this.amount <= 0) {
      return {
        isValid: false,
        message: `Validation Failed: Amount must be greater than zero. Received: ${this.amount}`
      };
    }

    // 4. Wallet lookup validation (if wallet manager provided)
    if (walletLookup && typeof walletLookup === 'function') {
      const senderWallet = walletLookup(this.sender);
      const receiverWallet = walletLookup(this.receiver);

      if (!senderWallet) {
        return {
          isValid: false,
          message: `Validation Failed: Sender wallet "${this.sender}" does not exist in the ledger.`
        };
      }

      if (!receiverWallet) {
        return {
          isValid: false,
          message: `Validation Failed: Receiver wallet "${this.receiver}" does not exist in the ledger.`
        };
      }

      // Check sufficient balance
      if (senderWallet.balance < this.amount) {
        return {
          isValid: false,
          message: `Validation Failed: Insufficient balance. Sender has ${senderWallet.balance} EcoCoins, but attempted to send ${this.amount} EcoCoins.`
        };
      }
    }

    return {
      isValid: true,
      message: 'Transaction is cryptographically valid and passed all business rule checks.'
    };
  }
}

module.exports = Transaction;
