// Centralized API Client for Eco Chain Shipping Backend

const BASE_URL = '/api';

async function request(endpoint, options = {}) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || data.message || `Request failed with status ${response.status}`);
    }
    return data;
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
}

export const api = {
  // System status
  getStatus: () => request('/status'),
  resetSystem: () => request('/reset', { method: 'POST' }),

  // Blockchain core
  getBlockchain: () => request('/blockchain'),
  createBlock: (data, transactions = []) =>
    request('/blockchain/create-block', {
      method: 'POST',
      body: JSON.stringify({ data, transactions }),
    }),
  validateBlockchain: () => request('/blockchain/validate'),
  tamperBlock: (blockIndex, tamperedData) =>
    request('/blockchain/tamper', {
      method: 'POST',
      body: JSON.stringify({ blockIndex, tamperedData }),
    }),
  repairBlockchain: () => request('/blockchain/repair', { method: 'POST' }),

  // Mining
  mineBlock: (minerAddress, difficulty) =>
    request('/mining/mine', {
      method: 'POST',
      body: JSON.stringify({ minerAddress, difficulty }),
    }),
  setDifficulty: (difficulty) =>
    request('/mining/difficulty', {
      method: 'POST',
      body: JSON.stringify({ difficulty }),
    }),

  // Hash generator & Avalanche
  generateHash: (input, compareWith = '') =>
    request('/hash', {
      method: 'POST',
      body: JSON.stringify({ input, compareWith }),
    }),

  // Wallets
  getWallets: () => request('/wallets'),
  createWallet: (walletData) =>
    request('/wallets', {
      method: 'POST',
      body: JSON.stringify(walletData),
    }),

  // Transactions
  getTransactions: () => request('/transactions'),
  createTransaction: (txData) =>
    request('/transactions', {
      method: 'POST',
      body: JSON.stringify(txData),
    }),
  validateTransactionDryRun: (txData) =>
    request('/transactions/validate', {
      method: 'POST',
      body: JSON.stringify(txData),
    }),

  // Merkle Tree
  generateMerkleTree: (items) =>
    request('/merkle/generate', {
      method: 'POST',
      body: JSON.stringify({ items }),
    }),
  getBlockMerkleTree: (blockIndex) => request(`/merkle/block/${blockIndex}`),

  // Shipments & Smart Contract
  getShipments: () => request('/shipments'),
  createShipment: (shipmentData) =>
    request('/shipments', {
      method: 'POST',
      body: JSON.stringify(shipmentData),
    }),
  updateShipmentStatus: (id, nextStatus, note = '') =>
    request(`/shipments/${id}/status`, {
      method: 'POST',
      body: JSON.stringify({ nextStatus, note }),
    }),
  getSmartContractInfo: () => request('/smart-contract'),

  // Explorer
  searchExplorer: (query) => request(`/explorer/search?q=${encodeURIComponent(query)}`),
};
