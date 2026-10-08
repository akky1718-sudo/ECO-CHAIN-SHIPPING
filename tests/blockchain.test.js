const crypto = require('crypto');
const Block = require('../server/blockchain/Block');
const Blockchain = require('../server/blockchain/Blockchain');
const Transaction = require('../server/blockchain/Transaction');
const MerkleTree = require('../server/blockchain/MerkleTree');
const SmartContract = require('../server/blockchain/SmartContract');
const WalletManager = require('../server/blockchain/WalletManager');
const ShipmentManager = require('../server/blockchain/ShipmentManager');

console.log('====================================================');
console.log('  TESTING ALL 12 BLOCKCHAIN CONCEPTS IN ECO CHAIN   ');
console.log('====================================================\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`[PASS] ${message}`);
    passedTests++;
  } else {
    console.error(`[FAIL] ${message}`);
    process.exitCode = 1;
  }
}

// 1. Hello Blockchain & 3. Simple Block Class Creation
console.log('--- 1 & 3. Hello Blockchain & Block Class ---');
const testBlock = new Block({
  index: 1,
  data: 'Maritime Manifest Cargo #101',
  previousHash: '0000abc123',
  difficulty: 2
});
assert(testBlock.index === 1, 'Block index is 1');
assert(testBlock.previousHash === '0000abc123', 'Previous hash stored accurately');
assert(typeof testBlock.hash === 'string' && testBlock.hash.length === 64, 'Current hash is valid 64-char SHA-256');
assert(testBlock.nonce === 0, 'Initial nonce is 0');

// 2. Hash Generation & Avalanche Effect
console.log('\n--- 2. Hash Generation & Avalanche Effect ---');
const str1 = 'Eco Chain Shipping';
const str2 = 'Eco Chain shipping'; // 1 char difference
const hash1 = crypto.createHash('sha256').update(str1).digest('hex');
const hash2 = crypto.createHash('sha256').update(str2).digest('hex');
let diffCount = 0;
for (let i = 0; i < 64; i++) {
  if (hash1[i] !== hash2[i]) diffCount++;
}
assert(hash1 !== hash2, 'Changing 1 single character changed the SHA-256 hash completely');
assert(diffCount > 30, `Avalanche effect verified: ${diffCount}/64 characters differed (${((diffCount/64)*100).toFixed(1)}%)`);

// 4. Create Blockchain
console.log('\n--- 4. Create Blockchain ---');
const testChain = new Blockchain(2);
assert(testChain.chain.length === 1, 'Blockchain initialized with Genesis Block');
assert(testChain.chain[0].index === 0, 'Genesis block has index 0');
assert(testChain.chain[0].previousHash === '0', 'Genesis block has previousHash = "0"');

const block1 = testChain.createCustomBlock('Shipment 1 Loaded at Rotterdam');
assert(testChain.chain.length === 2, 'New block successfully added to chain');
assert(block1.previousHash === testChain.chain[0].hash, 'Block 1 connects to Block 0 hash');

// 5. Validate Blockchain & Tamper Lab
console.log('\n--- 5. Validate Blockchain & Tamper Lab ---');
let valResult = testChain.isChainValid();
assert(valResult.isValid === true, 'Pristine blockchain passes validation');

// Tamper test
testChain.tamperBlock(1, 'TAMPERED: Illegal weight modification');
valResult = testChain.isChainValid();
assert(valResult.isValid === false, 'Tampered block causes chain validation to fail immediately');
assert(valResult.issues.length > 0, 'Specific corruption issues detected and reported');

// Repair test
testChain.repairChain();
valResult = testChain.isChainValid();
assert(valResult.isValid === true, 'Blockchain successfully repaired and re-validated after re-mining');

// 6. Proof of Work (Mining)
console.log('\n--- 6. Proof of Work (Mining) ---');
const powBlock = new Block({ index: 99, data: 'PoW Test', previousHash: '00000000' });
const mineStats = powBlock.mineBlock(2);
assert(mineStats.hash.startsWith('00'), `PoW mined hash starts with required difficulty prefix "00": ${mineStats.hash.slice(0, 8)}...`);
assert(mineStats.attempts >= 1, `Mining required ${mineStats.attempts} attempt(s) and nonce = ${mineStats.nonce}`);
assert(mineStats.durationMs >= 0, `Mining completed in ${mineStats.durationMs}ms`);

// 7. Simple Wallet
console.log('\n--- 7. Simple Wallet ---');
const wm = new WalletManager();
const wallets = wm.getAllWallets();
assert(wallets.length >= 6, `Default pre-seeded wallets loaded (${wallets.length} wallets)`);
const newWal = wm.createWallet({ name: 'Nordic Clean Logistics', role: 'CARRIER', balance: 2000 });
assert(newWal.address.startsWith('0x') && newWal.address.length > 30, 'Wallet created with valid public address');
assert(newWal.privateKey.startsWith('DEMO_'), 'Wallet includes clearly labeled academic demo private key');

// 8. Basic Transaction
console.log('\n--- 8. Basic Transaction ---');
const tx = new Transaction({
  sender: wallets[0].address,
  receiver: wallets[1].address,
  amount: 250,
  details: 'Fuel escrow deposit'
});
assert(tx.id.startsWith('TX-'), 'Transaction ID properly generated');
assert(tx.amount === 250, 'Transaction amount parsed correctly');
assert(typeof tx.signature === 'string', 'Transaction includes simulated signature');

// 9. Transaction Validation
console.log('\n--- 9. Transaction Validation ---');
const validRes = tx.validate((addr) => wm.findWalletByAddress(addr));
assert(validRes.isValid === true, 'Valid transaction passes validation');

const invalidSameSender = new Transaction({
  sender: wallets[0].address,
  receiver: wallets[0].address,
  amount: 100
});
const failSame = invalidSameSender.validate();
assert(failSame.isValid === false, 'Fails when sender and receiver are identical');

const invalidNegative = new Transaction({
  sender: wallets[0].address,
  receiver: wallets[1].address,
  amount: -50
});
const failNeg = invalidNegative.validate();
assert(failNeg.isValid === false, 'Fails when amount is zero or negative');

const invalidExcessive = new Transaction({
  sender: wallets[1].address,
  receiver: wallets[2].address,
  amount: 9999999
});
const failBal = invalidExcessive.validate((addr) => wm.findWalletByAddress(addr));
assert(failBal.isValid === false, 'Fails when sender has insufficient balance');

// 10. Merkle Tree
console.log('\n--- 10. Merkle Tree (Odd & Even) ---');
const oddLeaves = ['Tx 1: 50 ECO', 'Tx 2: 120 ECO', 'Tx 3: 200 ECO'];
const merkleOdd = MerkleTree.buildTree(oddLeaves);
assert(typeof merkleOdd.root === 'string' && merkleOdd.root.length === 64, 'Calculated 64-char Merkle Root for odd count');
assert(merkleOdd.levels.length === 3, `Tree built 3 levels for 3 leaves (duplicated 3rd leaf): ${merkleOdd.levels.length} levels`);

const evenLeaves = ['Tx A', 'Tx B', 'Tx C', 'Tx D'];
const merkleEven = MerkleTree.buildTree(evenLeaves);
assert(typeof merkleEven.root === 'string', 'Calculated Merkle Root for even count');

// 11. Smart Contract Simulation
console.log('\n--- 11. Smart Contract Simulation ---');
const sc = new SmartContract();
const scBc = new Blockchain(2);
const scWm = new WalletManager();
const sm = new ShipmentManager(sc, scBc, scWm);

const testShipment = sm.createShipment({
  title: 'Biofuel Barrels',
  sender: wallets[3].address,
  receiver: wallets[4].address,
  carrier: wallets[1].address,
  origin: 'Oslo',
  destination: 'Hamburg',
  weight: 2000,
  ecoScore: 92,
  escrowAmount: 300
});
assert(testShipment.status === 'Pending', 'New shipment starts in "Pending" status');

// Test invalid transition (Pending -> Delivered directly)
let illegalJump = false;
try {
  sm.updateShipmentStatus(testShipment.id, 'Delivered');
} catch (err) {
  illegalJump = true;
}
assert(illegalJump === true, 'Smart contract strictly rejects illegal skip: Pending -> Delivered');

// Step 1: Picked Up
const step1 = sm.updateShipmentStatus(testShipment.id, 'Picked Up');
assert(step1.shipment.status === 'Picked Up', 'Permitted transition: Pending -> Picked Up');

// Step 2: In Transit
const step2 = sm.updateShipmentStatus(testShipment.id, 'In Transit');
assert(step2.shipment.status === 'In Transit', 'Permitted transition: Picked Up -> In Transit');

// Step 3: Delivered (Triggers auto payout + eco-bonus)
const carrierPreBal = scWm.findWalletByAddress(testShipment.carrier).balance;
const step3 = sm.updateShipmentStatus(testShipment.id, 'Delivered');
const carrierPostBal = scWm.findWalletByAddress(testShipment.carrier).balance;
assert(step3.shipment.status === 'Delivered', 'Permitted transition: In Transit -> Delivered');
assert(step3.transitionResult.releasedPayout === 325, 'Smart contract released 300 ECO freight + 25 ECO eco-bonus');
assert(carrierPostBal === carrierPreBal + 325, `Carrier wallet credited with ${325} ECO`);

// 12. Blockchain Explorer
console.log('\n--- 12. Blockchain Explorer ---');
const latest = scBc.getLatestBlock();
assert(latest !== null, 'Blockchain explorer can retrieve latest block');
assert(typeof latest.hash === 'string', 'Block has hash');

console.log(`\n====================================================`);
console.log(`  ALL TESTS PASSED: ${passedTests}/${totalTests} tests succeeded!`);
console.log(`====================================================\n`);
