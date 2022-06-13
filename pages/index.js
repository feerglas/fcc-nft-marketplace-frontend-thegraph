// How to get all listed NFTs? They are stored in the contract in a mapping...
// -> We will index the events off-chain and then read from our database.
// -> Setup a server to listen for those events to be fired, and add them to a
// database to query

import { useMoralisQuery, useMoralis } from 'react-moralis';
import NFTBox from '../components/NFTBox';
import networkMapping from '../constants/networkMapping.json';
import GET_ACTIVE_ITEMS from '../constants/subgraphQueries';
import { useQuery } from '@apollo/client';

export default function Home() {
  const { isWeb3Enabled, chainId } = useMoralis();
  const chainString = chainId ? parseInt(chainId).toString() : '31337';
  const marketplaceAddress = networkMapping[chainString].NFTMarketplace[0];

  const { loading, error, data: listedNfts } = useQuery(GET_ACTIVE_ITEMS);

  return (
    <div className="container mx-auto">
      <h1 className="px-4 py-4 font-bold text-2xl">Recently Listed</h1>
      <div className="flex flex-wrap">
        {isWeb3Enabled ? (
          loading || !listedNfts ? (
            <div>Loading</div>
          ) : (
            listedNfts.activeItems.map((nft, index) => {
              console.log(nft);
              const { price, nftAddress, tokenId, seller } = nft;

              return (
                <div key={index}>
                  <NFTBox
                    price={price}
                    nftAddress={nftAddress}
                    tokenId={tokenId}
                    marketplaceAddress={marketplaceAddress}
                    seller={seller}
                  />
                </div>
              );
            })
          )
        ) : (
          <div>web3 currently not enabled</div>
        )}
      </div>
    </div>
  );
}
