// Global variables
let provider;
let signer;
let contract;
let account;

// DOM elements
const connectButton = document.getElementById('connectButton');
const mintButton = document.getElementById('mintButton');
const deleteButton = document.getElementById('deleteButton');
const propertyList = document.getElementById('propertyList');
const accountSpan = document.getElementById('account');
const networkSpan = document.getElementById('network');
const balanceSpan = document.getElementById('balance');

// Initialize the app
window.addEventListener('load', async () => {
  console.log('🚀 Initializing Real Estate DApp...');

  // Check if MetaMask is installed
  if (typeof window.ethereum !== 'undefined') {
    console.log('✅ MetaMask detected');
    provider = new ethers.providers.Web3Provider(window.ethereum);

    // Listen for account changes
    window.ethereum.on('accountsChanged', (accounts) => {
      if (accounts.length > 0) {
        connectWallet();
      } else {
        disconnectWallet();
      }
    });

    // Listen for network changes
    window.ethereum.on('chainChanged', () => {
      window.location.reload();
    });

    // Try to connect automatically
    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        await connectWallet();
      }
    } catch (error) {
      console.log('No auto-connect available');
    }
  } else {
    console.log('❌ MetaMask not detected');
    showError('Please install MetaMask to use this DApp');
  }

  // Set up event listeners
  setupEventListeners();

  // Load properties from DB
  await loadProperties();
});

// Set up event listeners
function setupEventListeners() {
  connectButton.addEventListener('click', connectWallet);
  mintButton.addEventListener('click', mintProperty);
  if (deleteButton) deleteButton.addEventListener('click', deletePropertyById);
}

// Connect wallet
async function connectWallet() {
  try {
    console.log('🔌 Connecting wallet...');

    await window.ethereum.request({ method: 'eth_requestAccounts' });

    signer = provider.getSigner();
    account = await signer.getAddress();

    const network = await provider.getNetwork();
    const codeAtAddress = await provider.getCode(CONTRACT_ADDRESS);
    if (!CONTRACT_ADDRESS || CONTRACT_ADDRESS === '0x0000000000000000000000000000000000000000' || codeAtAddress === '0x') {
      showError(`Configured address in abi.js is not a contract on ${network.name}. Update CONTRACT_ADDRESS to your deployed contract.`);
      console.error('Invalid CONTRACT_ADDRESS. No contract code at address:', CONTRACT_ADDRESS);
      return;
    }

    contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

    await updateWalletInfo();

    console.log('✅ Wallet connected:', account);
    showSuccess('Wallet connected successfully!');
  } catch (error) {
    console.error('❌ Error connecting wallet:', error);
    showError('Failed to connect wallet: ' + error.message);
  }
}

// Disconnect wallet
function disconnectWallet() {
  account = null;
  signer = null;
  contract = null;

  accountSpan.textContent = 'Not connected';
  networkSpan.textContent = '-';
  balanceSpan.textContent = '-';
  propertyList.innerHTML = '<p>Please connect your wallet to view properties.</p>';

  connectButton.textContent = 'Connect Wallet';
  connectButton.disabled = false;

  console.log('🔌 Wallet disconnected');
}

// Update wallet information
async function updateWalletInfo() {
  try {
    const network = await provider.getNetwork();
    networkSpan.textContent = network.name;

    const balance = await provider.getBalance(account);
    const balanceInEth = ethers.utils.formatEther(balance);
    balanceSpan.textContent = parseFloat(balanceInEth).toFixed(4) + ' ETH';

    accountSpan.textContent = account.substring(0, 6) + '...' + account.substring(38);

    connectButton.textContent = 'Connected';
    connectButton.disabled = true;

  } catch (error) {
    console.error('❌ Error updating wallet info:', error);
  }
}

// ✅ Mint Property
async function mintProperty() {
  try {
    console.log('🏠 Minting new property (DB store)...');

    const name = document.getElementById('propertyName').value.trim();
    const location = document.getElementById('location').value.trim();
    const price = document.getElementById('price').value.trim();

    if (!name || !location || !price) {
      showError('Please fill in all fields');
      return;
    }

    mintButton.disabled = true;
    mintButton.textContent = 'Saving...';

    // Save into DB via backend
    const res = await fetch("/api/properties", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, location, value: price })
    });

    const data = await res.json();
    if (data.error) {
      showError(data.error);
      return;
    }

    // Display on frontend
    displayProperty(data);

    // Clear form
    document.getElementById('propertyName').value = '';
    document.getElementById('location').value = '';
    document.getElementById('price').value = '';

    showSuccess('Property stored in DB successfully!');
  } catch (error) {
    console.error('❌ Error saving property:', error);
    showError('Failed to store property: ' + error.message);
  } finally {
    mintButton.disabled = false;
    mintButton.textContent = 'Mint Property';
  }
}

// ✅ Load Properties
async function loadProperties() {
  try {
    console.log('📋 Loading properties from DB...');
    const res = await fetch("/api/properties");
    const properties = await res.json();

    propertyList.innerHTML = '';
    if (properties.length === 0) {
      propertyList.innerHTML = '<p>No properties found. Add one!</p>';
      return;
    }

    properties.forEach(p => displayProperty(p));
    console.log('✅ Properties loaded from DB');
  } catch (error) {
    console.error('❌ Error loading properties:', error);
    propertyList.innerHTML = '<p>Error loading properties. Please check the console for details.</p>';
  }
}

// Display a single property
function displayProperty(prop) {
  const div = document.createElement('div');
  div.className = 'property-card';

  div.innerHTML = `
    <h3 class="property-title">${prop.name}</h3>
    <p class="property-detail"><strong>ID:</strong> #${prop.id}</p>
    <p class="property-detail"><strong>Location:</strong> ${prop.location}</p>
    <p class="property-detail"><strong>Value:</strong> ${prop.value} ETH</p>
  `;

  propertyList.appendChild(div);
}

// ✅ Delete Property
async function deletePropertyById() {
  try {
    const id = document.getElementById('deleteId').value.trim();
    if (!id) {
      showError("Please enter a Property ID");
      return;
    }

    deleteButton.disabled = true;
    deleteButton.textContent = "Deleting...";

    const res = await fetch(`/api/properties/${id}`, {
      method: "DELETE"
    });

    const data = await res.json();
    if (data.error) {
      showError(data.error);
      return;
    }

    if (data.deleted === 0) {
      showError(`No property found with ID ${id}`);
    } else {
      showSuccess(`Property #${id} deleted successfully!`);
      // Reload property list
      await loadProperties();
      // Clear input
      document.getElementById('deleteId').value = '';
    }
  } catch (error) {
    console.error("❌ Error deleting property:", error);
    showError("Failed to delete property: " + error.message);
  } finally {
    deleteButton.disabled = false;
    deleteButton.textContent = "Delete Property";
  }
}

// Get user-friendly error message
function getErrorMessage(error) {
  if (error.message.includes('user rejected')) {
    return 'Transaction rejected by user';
  } else if (error.message.includes('insufficient funds')) {
    return 'Insufficient funds for transaction';
  } else if (error.message.includes('execution reverted')) {
    return 'Transaction failed. Please check if the contract is deployed correctly.';
  } else if (error.message.includes('UNPREDICTABLE_GAS_LIMIT')) {
    return 'Gas estimation failed. Please try again.';
  } else if (error.message.includes('External transactions to internal accounts cannot include data')) {
    return 'The configured address is an EOA, not a contract. Update CONTRACT_ADDRESS in abi.js to your deployed contract address on this network.';
  } else {
    return error.message;
  }
}

// Show success message
function showSuccess(message) {
  alert('✅ ' + message);
}

// Show error message
function showError(message) {
  alert('❌ ' + message);
}

// Show info message
function showInfo(message) {
  alert('ℹ️ ' + message);
}
