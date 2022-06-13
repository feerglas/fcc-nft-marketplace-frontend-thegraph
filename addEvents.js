const Moralis = require('moralis/node');
require('dotenv').config();
const contractAddresses = require('./constants/networkMapping.json');
const chainId = process.env.chainId || 31337;
const contractAddress = contractAddresses[chainId]['NFTMarketplace'][0];

// Moralis understands localchain as 1337
const moralisChainId = chainId === '31337' ? '1337' : chainId;

const SERVER_URL = process.env.NEXT_PUBLIC_MORALIS_SERVER_URL;
const APP_ID = process.env.NEXT_PUBLIC_MORALIS_APP_ID;
const MASTER_KEY = process.env.MORALIS_MASTER_KEY;

async function main() {
  await Moralis.start({
    serverUrl: SERVER_URL,
    appId: APP_ID,
    masterKey: MASTER_KEY,
  });

  console.log(`Working with contract address ${contractAddress}`);

  const itemListedOptions = {
    chainId: moralisChainId,
    address: contractAddress,
    sync_historical: true,
    topic: 'ItemListed(address, address, uint256, uint256)',
    abi: {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'seller',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'nftAddress',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'uint256',
          name: 'tokenId',
          type: 'uint256',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'price',
          type: 'uint256',
        },
      ],
      name: 'ItemListed',
      type: 'event',
    },
    tableName: 'ItemListed',
  };

  const itemBoughtOptions = {
    chainId: moralisChainId,
    address: contractAddress,
    sync_historical: true,
    topic: 'ItemBought(address, address, uint256, uint256)',
    abi: {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'buyer',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'nftAddress',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'uint256',
          name: 'tokenId',
          type: 'uint256',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'price',
          type: 'uint256',
        },
      ],
      name: 'ItemBought',
      type: 'event',
    },
    tableName: 'ItemBought',
  };

  const itemCanceledOptions = {
    chainId: moralisChainId,
    address: contractAddress,
    sync_historical: true,
    topic: 'ItemCanceled(address, address, uint256)',
    abi: {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'seller',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'nftAddress',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'uint256',
          name: 'tokenId',
          type: 'uint256',
        },
      ],
      name: 'ItemCanceled',
      type: 'event',
    },
    tableName: 'ItemCanceled',
  };

  const listedResponse = await Moralis.Cloud.run(
    'watchContractEvent',
    itemListedOptions,
    { useMasterKey: true }
  );

  const boughtResponse = await Moralis.Cloud.run(
    'watchContractEvent',
    itemBoughtOptions,
    { useMasterKey: true }
  );

  const canceledResponse = await Moralis.Cloud.run(
    'watchContractEvent',
    itemCanceledOptions,
    { useMasterKey: true }
  );

  if (
    listedResponse.success &&
    boughtResponse.success &&
    canceledResponse.success
  ) {
    console.log('Success! Database updated with watching event');
  } else {
    console.log('Error! Something went wrong with watching events');
  }
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
