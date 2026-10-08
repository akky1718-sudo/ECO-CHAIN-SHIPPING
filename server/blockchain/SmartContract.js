/**
 * SmartContract Class - "Eco Shipping Smart Contract"
 * Simulates a blockchain smart contract enforcing shipping state transitions,
 * escrow locks, and automatic payment / eco-bonus disbursements upon delivery.
 */
class SmartContract {
  constructor() {
    this.contractName = 'EcoShippingContract_v1.0';
    this.escrowBalance = 0; // Total EcoCoins held in escrow
    this.escrows = new Map(); // shipmentId -> { shipperAddress, carrierAddress, amount, ecoScoreBonus }
    this.executionLogs = [];
  }

  /**
   * Log smart contract action with timestamp and verification state
   */
  logEvent(action, shipmentId, status, details, success = true) {
    const entry = {
      id: `LOG-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 5)}`,
      timestamp: new Date().toISOString(),
      action,
      shipmentId,
      status,
      success,
      details
    };
    this.executionLogs.unshift(entry);
    if (this.executionLogs.length > 50) this.executionLogs.pop();
    return entry;
  }

  /**
   * Rule 1: Initialize Escrow when shipment is created
   */
  lockEscrow(shipmentId, shipperAddress, carrierAddress, freightAmount, ecoScore = 80) {
    const amount = Number(freightAmount);
    const bonus = ecoScore >= 80 ? 25 : 0; // Sustainability bonus for green carrier rating

    this.escrows.set(shipmentId, {
      shipmentId,
      shipperAddress,
      carrierAddress,
      amount,
      bonus,
      status: 'LOCKED',
      lockedAt: new Date().toISOString()
    });

    this.escrowBalance += amount;
    this.logEvent(
      'ESCROW_LOCKED',
      shipmentId,
      'Pending',
      `Locked ${amount} EcoCoins from shipper ${shipperAddress.slice(0, 8)}... into contract escrow. Potential Eco-Bonus: ${bonus} ECO.`
    );

    return {
      success: true,
      escrow: this.escrows.get(shipmentId)
    };
  }

  /**
   * Rule 2, 3, 4, 5: Verify status transition state machine
   * Permitted flow:
   * Pending -> Picked Up -> In Transit -> Delivered
   */
  validateStatusTransition(currentStatus, nextStatus) {
    const validTransitions = {
      Pending: ['Picked Up'],
      'Picked Up': ['In Transit'],
      'In Transit': ['Delivered'],
      Delivered: [] // Terminal state
    };

    const allowed = validTransitions[currentStatus] || [];
    if (!allowed.includes(nextStatus)) {
      return {
        isValid: false,
        reason: `Contract Rule Violation: Cannot transition status directly from "${currentStatus}" to "${nextStatus}". Permitted next state: [${allowed.join(', ') || 'None (Shipment already Delivered)'}].`
      };
    }

    return { isValid: true };
  }

  /**
   * Executes shipment state progression according to contract rules
   */
  executeTransition(shipment, nextStatus, walletManager) {
    const { id: shipmentId, status: currentStatus, sender, carrier, ecoScore } = shipment;

    // Rule check: is next status allowed?
    const check = this.validateStatusTransition(currentStatus, nextStatus);
    if (!check.isValid) {
      this.logEvent('TRANSITION_REJECTED', shipmentId, currentStatus, check.reason, false);
      return {
        success: false,
        error: check.reason,
        releasedPayout: 0
      };
    }

    // Process transition
    if (nextStatus === 'Picked Up') {
      if (!carrier) {
        const error = 'Contract Rule Violation: Shipment must be assigned to an authorized carrier before Picked Up.';
        this.logEvent('TRANSITION_REJECTED', shipmentId, currentStatus, error, false);
        return { success: false, error, releasedPayout: 0 };
      }
      this.logEvent(
        'STATUS_UPDATED',
        shipmentId,
        'Picked Up',
        `Carrier ${carrier.slice(0, 8)}... confirmed cargo receipt. Escrow remains held.`
      );
      return { success: true, newStatus: 'Picked Up', releasedPayout: 0 };
    }

    if (nextStatus === 'In Transit') {
      this.logEvent(
        'STATUS_UPDATED',
        shipmentId,
        'In Transit',
        'Shipment cleared maritime customs and is in transit via green eco-route.'
      );
      return { success: true, newStatus: 'In Transit', releasedPayout: 0 };
    }

    if (nextStatus === 'Delivered') {
      // Rule 4: Payment release upon confirmed Delivery!
      let escrow = this.escrows.get(shipmentId);
      const payoutAmount = escrow ? escrow.amount : 150; // fallback default
      const bonusAmount = ecoScore >= 80 ? 25 : 0;
      const totalPayout = payoutAmount + bonusAmount;

      // Transfer funds to carrier
      if (walletManager && typeof walletManager.transferDirect === 'function') {
        walletManager.transferDirect('ESCROW_CONTRACT', carrier, totalPayout);
      }

      if (escrow) {
        this.escrowBalance = Math.max(0, this.escrowBalance - escrow.amount);
        escrow.status = 'RELEASED';
        escrow.releasedAt = new Date().toISOString();
      }

      const logMsg = `Shipment verified DELIVERED! Smart contract automatically released ${payoutAmount} ECO freight payment + ${bonusAmount} ECO sustainability eco-bonus to carrier ${carrier.slice(0, 8)}...`;
      this.logEvent('DELIVERY_PAYOUT_EXECUTED', shipmentId, 'Delivered', logMsg, true);

      return {
        success: true,
        newStatus: 'Delivered',
        releasedPayout: totalPayout,
        payoutBreakdown: { freight: payoutAmount, ecoBonus: bonusAmount },
        message: logMsg
      };
    }

    return { success: true, newStatus: nextStatus, releasedPayout: 0 };
  }
}

module.exports = SmartContract;
