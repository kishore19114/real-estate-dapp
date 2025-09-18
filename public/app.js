// Global variables
let provider, signer, contract, account;
const BACKEND_URL = "http://127.0.0.1:5000";

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
  if (typeof window.ethereum !== 'undefined') {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    setupEventListeners();
  } else {
    alert("Please install MetaMask");
  }
});

function setupEventListeners() {
  connectButton.addEventListener('click', connectWallet);
  mintButton.addEventListener('click', mintProperty);
  deleteButton.addEventListener('click', deletePropertyById);
}

async function connectWallet() {
  await window.ethereum.request({ method: 'eth_requestAccounts' });
  signer = provider.getSigner();
  account = await signer.getAddress();
  const network = await provider.getNetwork();
  contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

  accountSpan.textContent = account.substring(0, 6) + "..." + account.slice(-4);
  networkSpan.textContent = network.name;
  const balance = await provider.getBalance(account);
  balanceSpan.textContent = ethers.utils.formatEther(balance) + " ETH";

  connectButton.textContent = "Connected";
  connectButton.disabled = true;

  loadPropertiesFromDB();
}

async function mintProperty() {
  const name = document.getElementById('propertyName').value.trim();
  const location = document.getElementById('location').value.trim();
  const price = document.getElementById('price').value.trim();

  if (!name || !location || !price) {
    alert("Fill all fields");
    return;
  }

  const valueWei = ethers.utils.parseEther(price);
  const tx = await contract.mintProperty(name, location, valueWei);
  await tx.wait();

  const newId = await contract.nextPropertyId() - 1;
  const prop = await contract.getProperty(newId);

  await fetch(`${BACKEND_URL}/properties`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: prop.id.toString(),
      name: prop.name,
      location: prop.location,
      value: ethers.utils.formatEther(prop.value)
    })
  });

  loadPropertiesFromDB();
  alert("✅ Property minted and saved to DB");
}

async function deletePropertyById() {
  const id = document.getElementById('deleteId').value.trim();
  if (!id) {
    alert("Enter an ID");
    return;
  }

  const tx = await contract.deleteProperty(id);
  await tx.wait();

  await fetch(`${BACKEND_URL}/properties/${id}`, { method: "DELETE" });
  loadPropertiesFromDB();
  alert("✅ Property deleted from blockchain & DB");
}

async function loadPropertiesFromDB() {
  const res = await fetch(`${BACKEND_URL}/properties`);
  const props = await res.json();
  propertyList.innerHTML = "";
  props.forEach(p => {
    displayProperty(p);
  });
}

function displayProperty(prop) {
  const div = document.createElement("div");
  div.className = "property-card";
  div.innerHTML = `
    <h3>${prop.name}</h3>
    <p><b>ID:</b> ${prop.id}</p>
    <p><b>Location:</b> ${prop.location}</p>
    <p><b>Value:</b> ${prop.value} ETH</p>
  `;
  propertyList.appendChild(div);
}
