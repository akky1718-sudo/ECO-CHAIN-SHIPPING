const crypto = require('crypto');

/**
 * MerkleTree Class
 * Implements cryptographic binary tree for transaction verification
 * Handles leaf hashing, pairwise combination, odd-leaf duplication, and root calculation.
 */
class MerkleTree {
  static sha256(data) {
    return crypto.createHash('sha256').update(typeof data === 'string' ? data : JSON.stringify(data)).digest('hex');
  }

  /**
   * Generates a Merkle Tree from an array of transactions or data objects.
   * Returns complete hierarchy levels for visual representation.
   */
  static buildTree(items) {
    if (!items || items.length === 0) {
      const emptyHash = MerkleTree.sha256('EMPTY_TREE');
      return {
        root: emptyHash,
        levels: [
          [{ id: 'L0-0', hash: emptyHash, shortHash: emptyHash.slice(0, 10) + '...', label: 'Empty Node', level: 0 }]
        ],
        leafCount: 0
      };
    }

    // Step 1: Compute hashes for all leaf elements
    let currentLevel = items.map((item, index) => {
      let dataString;
      let label;

      if (typeof item === 'string') {
        dataString = item;
        label = item.length > 24 ? item.slice(0, 24) + '...' : item;
      } else if (item.id) {
        dataString = JSON.stringify({
          id: item.id,
          sender: item.sender,
          receiver: item.receiver,
          amount: item.amount,
          type: item.type
        });
        label = `${item.id}: ${item.amount || 0} ECO`;
      } else {
        dataString = JSON.stringify(item);
        label = `Tx #${index + 1}`;
      }

      const hash = MerkleTree.sha256(dataString);
      return {
        id: `L0-${index}`,
        index,
        label,
        data: item,
        hash,
        shortHash: hash.slice(0, 10) + '...',
        level: 0
      };
    });

    const levels = [[...currentLevel]];
    let levelIndex = 0;

    // Step 2: Build tree upwards level by level
    while (currentLevel.length > 1) {
      const nextLevel = [];
      levelIndex++;

      // If odd number of nodes in this level, duplicate the last node
      const workingLevel = [...currentLevel];
      if (workingLevel.length % 2 !== 0) {
        const lastNode = workingLevel[workingLevel.length - 1];
        workingLevel.push({
          ...lastNode,
          id: `${lastNode.id}-dup`,
          label: `${lastNode.label} (Duplicated)`,
          isDuplicated: true
        });
      }

      for (let i = 0; i < workingLevel.length; i += 2) {
        const left = workingLevel[i];
        const right = workingLevel[i + 1];
        const combinedHash = MerkleTree.sha256(left.hash + right.hash);

        nextLevel.push({
          id: `L${levelIndex}-${i / 2}`,
          hash: combinedHash,
          shortHash: combinedHash.slice(0, 10) + '...',
          label: `Hash(${left.id} + ${right.id})`,
          leftChildId: left.id,
          rightChildId: right.id,
          leftShortHash: left.hash.slice(0, 8),
          rightShortHash: right.hash.slice(0, 8),
          level: levelIndex
        });
      }

      levels.push(nextLevel);
      currentLevel = nextLevel;
    }

    return {
      root: currentLevel[0].hash,
      levels, // Levels ordered from Level 0 (leaves) up to Level N (root)
      leafCount: items.length
    };
  }

  /**
   * Helper to quickly get just the Merkle Root for a block's transactions
   */
  static getRoot(items) {
    return MerkleTree.buildTree(items).root;
  }
}

module.exports = MerkleTree;
