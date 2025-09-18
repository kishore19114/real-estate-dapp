// Contract ABI
const CONTRACT_ABI = [
	{
		"inputs": [],
		"name": "nextPropertyId",
		"outputs": [
			{ "internalType": "uint256", "name": "", "type": "uint256" }
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{ "internalType": "uint256", "name": "_id", "type": "uint256" }
		],
		"name": "getProperty",
		"outputs": [
			{
				"components": [
					{ "internalType": "uint256", "name": "id", "type": "uint256" },
					{ "internalType": "string", "name": "name", "type": "string" },
					{ "internalType": "string", "name": "location", "type": "string" },
					{ "internalType": "uint256", "name": "value", "type": "uint256" }
				],
				"internalType": "struct RealEstateToken.Property",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{ "internalType": "uint256", "name": "", "type": "uint256" }
		],
		"name": "properties",
		"outputs": [
			{ "internalType": "uint256", "name": "id", "type": "uint256" },
			{ "internalType": "string", "name": "name", "type": "string" },
			{ "internalType": "string", "name": "location", "type": "string" },
			{ "internalType": "uint256", "name": "value", "type": "uint256" }
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{ "internalType": "uint256", "name": "", "type": "uint256" }
		],
		"name": "propertyOwner",
		"outputs": [
			{ "internalType": "address", "name": "", "type": "address" }
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{ "internalType": "string", "name": "_name", "type": "string" },
			{ "internalType": "string", "name": "_location", "type": "string" },
			{ "internalType": "uint256", "name": "_value", "type": "uint256" }
		],
		"name": "mintProperty",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{ "internalType": "uint256", "name": "_id", "type": "uint256" }
		],
		"name": "deleteProperty",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{ "indexed": true, "internalType": "uint256", "name": "id", "type": "uint256" },
			{ "indexed": false, "internalType": "string", "name": "name", "type": "string" },
			{ "indexed": false, "internalType": "string", "name": "location", "type": "string" },
			{ "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }
		],
		"name": "PropertyMinted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{ "indexed": true, "internalType": "uint256", "name": "id", "type": "uint256" }
		],
		"name": "PropertyDeleted",
		"type": "event"
	}
];

// Contract Address - UPDATE THIS AFTER DEPLOYMENT
const CONTRACT_ADDRESS = "0xC9eE55B405a7066Ec410b533607e219a1163A1cd"; // Replace with your deployed contract address

// Export for use in app.js
window.CONTRACT_ABI = CONTRACT_ABI;
window.CONTRACT_ADDRESS = CONTRACT_ADDRESS;