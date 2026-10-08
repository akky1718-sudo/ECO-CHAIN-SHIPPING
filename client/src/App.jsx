import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import DashboardPage from './pages/DashboardPage';
import ShipmentsPage from './pages/ShipmentsPage';
import BlockchainPage from './pages/BlockchainPage';
import MiningPage from './pages/MiningPage';
import WalletsPage from './pages/WalletsPage';
import TransactionsPage from './pages/TransactionsPage';
import MerkleTreePage from './pages/MerkleTreePage';
import SmartContractPage from './pages/SmartContractPage';
import ExplorerPage from './pages/ExplorerPage';
import HashGeneratorPage from './pages/HashGeneratorPage';
import DemoGuidePage from './pages/DemoGuidePage';
import AboutBlockchainPage from './pages/AboutBlockchainPage';
import { api } from './api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [status, setStatus] = useState(null);
  const [blockchain, setBlockchain] = useState(null);
  const [shipments, setShipments] = useState([]);
  const [wallets, setWallets] = useState([]);
  const [transactions, setTransactions] = useState({ pending: [], confirmed: [] });
  const [loading, setLoading] = useState(true);

  const fetchAllData = useCallback(async () => {
    try {
      const [statusRes, chainRes, shpRes, walRes, txRes] = await Promise.all([
        api.getStatus(),
        api.getBlockchain(),
        api.getShipments(),
        api.getWallets(),
        api.getTransactions(),
      ]);

      setStatus(statusRes);
      setBlockchain(chainRes);
      setShipments(shpRes);
      setWallets(walRes);
      setTransactions(txRes);
    } catch (err) {
      console.error('Failed to sync system data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
    // Poll status periodically (every 5 seconds) to keep views synced
    const timer = setInterval(fetchAllData, 5000);
    return () => clearInterval(timer);
  }, [fetchAllData]);

  const handleReset = async () => {
    if (window.confirm('Reset Eco Chain Shipping to initial demo state? All tampered or newly created test blocks will be reset.')) {
      try {
        await api.resetSystem();
        await fetchAllData();
      } catch (err) {
        alert(err.message || 'Reset failed');
      }
    }
  };

  const handleQuickRepair = async () => {
    try {
      await api.repairBlockchain();
      await fetchAllData();
    } catch (err) {
      alert(err.message || 'Repair failed');
    }
  };

  const handleCreateShipment = async (formData) => {
    const res = await api.createShipment(formData);
    await fetchAllData();
    return res;
  };

  const handleUpdateStatus = async (id, nextStatus, note = '') => {
    const res = await api.updateShipmentStatus(id, nextStatus, note);
    await fetchAllData();
    return res;
  };

  const handleCreateBlock = async (data) => {
    const res = await api.createBlock(data);
    await fetchAllData();
    return res;
  };

  const handleTamperBlock = async (blockIndex, tamperedData) => {
    const res = await api.tamperBlock(blockIndex, tamperedData);
    await fetchAllData();
    return res;
  };

  const handleRepairChain = async () => {
    const res = await api.repairBlockchain();
    await fetchAllData();
    return res;
  };

  const handleMine = async (minerAddress, difficulty) => {
    const res = await api.mineBlock(minerAddress, difficulty);
    await fetchAllData();
    return res;
  };

  const handleCreateWallet = async (walletData) => {
    const res = await api.createWallet(walletData);
    await fetchAllData();
    return res;
  };

  const handleCreateTransaction = async (txData) => {
    const res = await api.createTransaction(txData);
    await fetchAllData();
    return res;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        status={status}
        activeTab={activeTab}
        onNavigate={setActiveTab}
        onReset={handleReset}
        onQuickRepair={handleQuickRepair}
      />

      <div className="flex flex-1">
        {/* Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          status={status}
        />

        {/* Main Content Viewport */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
          {loading && !status ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-slate-400">
              <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm">Connecting to Eco Chain Shipping Blockchain Ledger...</p>
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <DashboardPage
                  status={status}
                  shipments={shipments}
                  blockchain={blockchain}
                  onNavigate={setActiveTab}
                  onMine={handleMine}
                />
              )}

              {activeTab === 'shipments' && (
                <ShipmentsPage
                  shipments={shipments}
                  wallets={wallets}
                  onRefresh={fetchAllData}
                  onCreateShipment={handleCreateShipment}
                  onUpdateStatus={handleUpdateStatus}
                />
              )}

              {activeTab === 'blockchain' && (
                <BlockchainPage
                  blockchain={blockchain}
                  status={status}
                  onRefresh={fetchAllData}
                  onCreateBlock={handleCreateBlock}
                  onTamperBlock={handleTamperBlock}
                  onRepairChain={handleRepairChain}
                />
              )}

              {activeTab === 'mining' && (
                <MiningPage
                  blockchain={blockchain}
                  status={status}
                  wallets={wallets}
                  onMine={handleMine}
                  onRefresh={fetchAllData}
                />
              )}

              {activeTab === 'wallets' && (
                <WalletsPage
                  wallets={wallets}
                  onCreateWallet={handleCreateWallet}
                  onRefresh={fetchAllData}
                />
              )}

              {activeTab === 'transactions' && (
                <TransactionsPage
                  transactions={transactions}
                  wallets={wallets}
                  onCreateTransaction={handleCreateTransaction}
                  onRefresh={fetchAllData}
                />
              )}

              {activeTab === 'merkle' && (
                <MerkleTreePage
                  blockchain={blockchain}
                />
              )}

              {activeTab === 'smart-contract' && (
                <SmartContractPage
                  shipments={shipments}
                  wallets={wallets}
                  onUpdateStatus={handleUpdateStatus}
                  onRefresh={fetchAllData}
                />
              )}

              {activeTab === 'explorer' && (
                <ExplorerPage
                  blockchain={blockchain}
                  transactions={transactions}
                  onNavigate={setActiveTab}
                />
              )}

              {activeTab === 'hash' && (
                <HashGeneratorPage />
              )}

              {activeTab === 'demo' && (
                <DemoGuidePage
                  status={status}
                  blockchain={blockchain}
                  shipments={shipments}
                  wallets={wallets}
                  onNavigate={setActiveTab}
                  onRefresh={fetchAllData}
                />
              )}

              {activeTab === 'about' && (
                <AboutBlockchainPage />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
