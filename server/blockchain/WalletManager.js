const Wallet = require('./Wallet');

/**
 * WalletManager Class
 * Manages demo academic wallets and balances for the Eco Chain Shipping system.
 */
class WalletManager {
  constructor() {
    this.wallets = new Map();
    this.seedDefaultWallets();
  }

  seedDefaultWallets() {
    this.wallets.clear();

    const initialWallets = [
      {
        id: 'WAL-ADMIN',
        name: 'EcoShip Network Authority',
        role: 'ADMIN',
        balance: 50000,
        address: '0x1A88F3B9200109C482C318260D0429AA96B501A1',
        privateKey: 'DEMO_KEY_ADMIN_AUTHORITY_SEC_99'
      },
      {
        id: 'WAL-CARRIER-1',
        name: 'GreenOcean Freight Carriers',
        role: 'CARRIER',
        balance: 3500,
        address: '0x83BD6A329F1A42C7D1B998E204C61F92E3812B44',
        privateKey: 'DEMO_KEY_GREENOCEAN_CARRIER_SEC_44'
      },
      {
        id: 'WAL-CARRIER-2',
        name: 'Pacific EcoLogistics Ltd',
        role: 'CARRIER',
        balance: 2800,
        address: '0x94C8284EA350F612B71295D34C9E731F2A835C11',
        privateKey: 'DEMO_KEY_PACIFICECO_CARRIER_SEC_11'
      },
      {
        id: 'WAL-SHIPPER-1',
        name: 'BioHarvest Organic Exports',
        role: 'SHIPPER',
        balance: 4500,
        address: '0x21D95A401C312061A028471822C05193B6109D78',
        privateKey: 'DEMO_KEY_BIOHARVEST_SHIPPER_SEC_78'
      },
      {
        id: 'WAL-RECEIVER-1',
        name: 'EcoRetail Global Distribution',
        role: 'RECEIVER',
        balance: 6200,
        address: '0x55E470129F9444B68140B51239A061C8B2945E99',
        privateKey: 'DEMO_KEY_ECORETAIL_RECEIVER_SEC_99'
      },
      {
        id: 'WAL-REGULATOR-1',
        name: 'CleanPort Maritime Customs & ESG Registry',
        role: 'REGULATOR',
        balance: 1500,
        address: '0x11F88210D5C93B201A5432906B18274A0182C6E2',
        privateKey: 'DEMO_KEY_CLEANPORT_REGULATOR_SEC_01'
      }
    ];

    initialWallets.forEach((w) => {
      this.wallets.set(w.address.toLowerCase(), new Wallet(w));
    });
  }

  getAllWallets() {
    return Array.from(this.wallets.values()).map((w) => w.toJSON(true));
  }

  findWalletByAddress(address) {
    if (!address) return null;
    return this.wallets.get(address.toLowerCase()) || null;
  }

  createWallet({ name, role = 'SHIPPER', balance = 1000 }) {
    const newWallet = new Wallet({ name, role, balance });
    this.wallets.set(newWallet.address.toLowerCase(), newWallet);
    return newWallet.toJSON(true);
  }

  transferDirect(fromAddress, toAddress, amount) {
    const num = Number(amount);
    if (isNaN(num) || num <= 0) return false;

    // Direct contract escrow release doesn't deduct from a standard wallet
    if (fromAddress !== 'ESCROW_CONTRACT' && fromAddress !== 'SYSTEM_MINT') {
      const sender = this.findWalletByAddress(fromAddress);
      if (!sender || sender.balance < num) return false;
      sender.balance -= num;
    }

    const receiver = this.findWalletByAddress(toAddress);
    if (receiver) {
      receiver.balance += num;
    }
    return true;
  }

  deduct(address, amount) {
    const w = this.findWalletByAddress(address);
    if (w && w.balance >= amount) {
      w.balance -= amount;
      return true;
    }
    return false;
  }

  credit(address, amount) {
    const w = this.findWalletByAddress(address);
    if (w) {
      w.balance += amount;
      return true;
    }
    return false;
  }
}

module.exports = WalletManager;
