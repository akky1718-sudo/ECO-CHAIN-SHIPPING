/**
 * ShipmentManager Class
 * Manages shipments, integrates with the smart contract, and produces blockchain records.
 */
class ShipmentManager {
  constructor(smartContract, blockchain, walletManager) {
    this.smartContract = smartContract;
    this.blockchain = blockchain;
    this.walletManager = walletManager;
    this.shipments = new Map();
    this.seedDefaultShipments();
  }

  seedDefaultShipments() {
    this.shipments.clear();

    const initial = [
      {
        id: 'ECO-SHP-101',
        title: 'Solar Panels & Micro-Inverters',
        sender: '0x21D95A401C312061A028471822C05193B6109D78',
        senderName: 'BioHarvest Organic Exports',
        receiver: '0x55E470129F9444B68140B51239A061C8B2945E99',
        receiverName: 'EcoRetail Global Distribution',
        carrier: '0x83BD6A329F1A42C7D1B998E204C61F92E3812B44',
        carrierName: 'GreenOcean Freight Carriers',
        origin: 'Port of Rotterdam, Netherlands',
        destination: 'Port of Hamburg, Germany',
        packageType: 'Clean Energy Hardware',
        weight: 1250,
        ecoScore: 94,
        carbonSavedKg: 340,
        status: 'Delivered',
        escrowAmount: 220,
        createdTimestamp: Date.now() - 86400000 * 3,
        history: [
          { status: 'Pending', timestamp: new Date(Date.now() - 86400000 * 3).toISOString(), note: 'Shipment registered & Escrow locked' },
          { status: 'Picked Up', timestamp: new Date(Date.now() - 86400000 * 2).toISOString(), note: 'Loaded onto Biofuel Electric Cargo Ship' },
          { status: 'In Transit', timestamp: new Date(Date.now() - 86400000 * 1).toISOString(), note: 'Crossed North Sea Maritime Corridor' },
          { status: 'Delivered', timestamp: new Date().toISOString(), note: 'Successfully delivered to Hamburg Green Depot; Escrow & Eco-Bonus paid' }
        ]
      },
      {
        id: 'ECO-SHP-102',
        title: 'Organic Fair-Trade Cocoa & Coffee',
        sender: '0x21D95A401C312061A028471822C05193B6109D78',
        senderName: 'BioHarvest Organic Exports',
        receiver: '0x55E470129F9444B68140B51239A061C8B2945E99',
        receiverName: 'EcoRetail Global Distribution',
        carrier: '0x94C8284EA350F612B71295D34C9E731F2A835C11',
        carrierName: 'Pacific EcoLogistics Ltd',
        origin: 'Port of Santos, Brazil',
        destination: 'Port of Antwerp, Belgium',
        packageType: 'Zero-Emission Packaged Produce',
        weight: 3800,
        ecoScore: 88,
        carbonSavedKg: 820,
        status: 'In Transit',
        escrowAmount: 380,
        createdTimestamp: Date.now() - 86400000 * 1.5,
        history: [
          { status: 'Pending', timestamp: new Date(Date.now() - 86400000 * 1.5).toISOString(), note: 'Order placed, Escrow 380 ECO held' },
          { status: 'Picked Up', timestamp: new Date(Date.now() - 86400000 * 1).toISOString(), note: 'Cargo verified at Santos Zero-Waste Terminal' },
          { status: 'In Transit', timestamp: new Date(Date.now() - 43200000).toISOString(), note: 'Sailing Atlantic Eco-Corridor' }
        ]
      },
      {
        id: 'ECO-SHP-103',
        title: 'Recycled Ocean Plastics Packaging',
        sender: '0x21D95A401C312061A028471822C05193B6109D78',
        senderName: 'BioHarvest Organic Exports',
        receiver: '0x55E470129F9444B68140B51239A061C8B2945E99',
        receiverName: 'EcoRetail Global Distribution',
        carrier: '0x83BD6A329F1A42C7D1B998E204C61F92E3812B44',
        carrierName: 'GreenOcean Freight Carriers',
        origin: 'Gothenburg Sustainable Harbor, Sweden',
        destination: 'Copenhagen EcoPort, Denmark',
        packageType: 'Circular Material Containers',
        weight: 640,
        ecoScore: 98,
        carbonSavedKg: 195,
        status: 'Pending',
        escrowAmount: 140,
        createdTimestamp: Date.now() - 10800000,
        history: [
          { status: 'Pending', timestamp: new Date(Date.now() - 10800000).toISOString(), note: 'Shipment created, waiting for carrier pickup' }
        ]
      }
    ];

    initial.forEach((s) => {
      this.shipments.set(s.id, s);
      // Ensure smart contract escrow ledger knows about these
      this.smartContract.lockEscrow(s.id, s.sender, s.carrier, s.escrowAmount, s.ecoScore);
    });
  }

  getAllShipments() {
    return Array.from(this.shipments.values());
  }

  getShipmentById(id) {
    return this.shipments.get(id) || null;
  }

  createShipment(data) {
    const id = `ECO-SHP-${Math.floor(100 + Math.random() * 900)}`;
    const weight = Number(data.weight) || 500;
    const ecoScore = Number(data.ecoScore) || 85;
    const escrowAmount = Number(data.escrowAmount) || Math.round(weight * 0.15 + 50);

    // Calculate CO2 savings estimation vs fossil-heavy transport
    const carbonSavedKg = Math.round(weight * (ecoScore / 100) * 0.35);

    const newShipment = {
      id,
      title: data.title || `Shipment ${id}`,
      sender: data.sender,
      senderName: data.senderName || 'Authorized Shipper',
      receiver: data.receiver,
      receiverName: data.receiverName || 'Authorized Consignee',
      carrier: data.carrier,
      carrierName: data.carrierName || 'Green Logistics Carrier',
      origin: data.origin || 'Port of Origin',
      destination: data.destination || 'Destination Hub',
      packageType: data.packageType || 'Standard Eco Cargo',
      weight,
      ecoScore,
      carbonSavedKg,
      status: 'Pending',
      escrowAmount,
      createdTimestamp: Date.now(),
      history: [
        {
          status: 'Pending',
          timestamp: new Date().toISOString(),
          note: `Shipment registered. Escrow of ${escrowAmount} EcoCoins locked.`
        }
      ]
    };

    // Lock Escrow in Smart Contract
    this.smartContract.lockEscrow(id, newShipment.sender, newShipment.carrier, escrowAmount, ecoScore);

    // Deduct escrow amount from shipper wallet
    this.walletManager.deduct(newShipment.sender, escrowAmount);

    // Save shipment
    this.shipments.set(id, newShipment);

    return newShipment;
  }

  /**
   * Advances shipment status using Smart Contract rules
   */
  updateShipmentStatus(shipmentId, nextStatus, note = '') {
    const shipment = this.getShipmentById(shipmentId);
    if (!shipment) {
      throw new Error(`Shipment "${shipmentId}" not found.`);
    }

    // Call smart contract to validate and execute transition
    const transitionResult = this.smartContract.executeTransition(
      shipment,
      nextStatus,
      this.walletManager
    );

    if (!transitionResult.success) {
      throw new Error(transitionResult.error);
    }

    // Update status and history
    shipment.status = nextStatus;
    shipment.history.push({
      status: nextStatus,
      timestamp: new Date().toISOString(),
      note: note || `Status transitioned to ${nextStatus} under Smart Contract verification.`
    });

    return {
      shipment,
      transitionResult
    };
  }
}

module.exports = ShipmentManager;
