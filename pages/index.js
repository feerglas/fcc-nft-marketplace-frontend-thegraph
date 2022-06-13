// How to get all listed NFTs? They are stored in the contract in a mapping...
// -> We will index the events off-chain and then read from our database.
// -> Setup a server to listen for those events to be fired, and add them to a
// database to query

import { useMoralisQuery, useMoralis } from 'react-moralis';
import NFTBox from '../components/NFTBox';

export default function Home() {
  const { data: listedNfts, isFetching: fetchingListedNfts } = useMoralisQuery(
    'ActiveItem',
    (query) => query.limit(10).descending('tokenId')
  );

  const { isWeb3Enabled } = useMoralis();

  return (
    <div className="container mx-auto">
      <h1 className="px-4 py-4 font-bold text-2xl">Recently Listed</h1>
      <div className="flex flex-wrap">
        {isWeb3Enabled ? (
          fetchingListedNfts ? (
            <div>Loading</div>
          ) : (
            listedNfts.map((nft, index) => {
              const { price, nftAddress, tokenId, marketplaceAddress, seller } =
                nft.attributes;

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
