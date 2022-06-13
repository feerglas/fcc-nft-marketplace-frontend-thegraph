import { Form, useNotification } from 'web3uikit';
import nftAbi from '../constants/BasicNft.json';
import nftMarketplaceAbi from '../constants/NFTMarketplace.json';
import { ethers } from 'ethers';
import { useMoralis, useWeb3Contract } from 'react-moralis';
import networkMapping from '../constants/networkMapping.json';

export default function Sell() {
  const { chainId } = useMoralis();
  const chainString = chainId ? parseInt(chainId).toString() : '31337';
  const marketplaceAddress = networkMapping[chainString].NFTMarketplace[0];
  const dispatch = useNotification();

  const { runContractFunction } = useWeb3Contract();

  const approveAndList = async (data) => {
    console.log('Approving');
    const nftAddress = data.data[0].inputResult;
    const tokenId = data.data[1].inputResult;
    const price = ethers.utils
      .parseUnits(data.data[2].inputResult, 'ether')
      .toString();

    const approveOptions = {
      abi: nftAbi,
      contractAddress: nftAddress,
      functionName: 'approve',
      params: {
        to: marketplaceAddress,
        tokenId,
      },
    };

    await runContractFunction({
      params: approveOptions,
      onSuccess: () => {
        handleAproveSuccess(nftAddress, tokenId, price);
      },
      onError: (error) => console.log(error),
    });
  };

  const handleListSuccess = async () => {
    dispatch({
      type: 'success',
      message: 'NFT listing',
      title: 'NFT listed',
      position: 'topR',
    });
  };

  const handleAproveSuccess = async (nftAddress, tokenId, price) => {
    console.log('time to list...');
    const listOptions = {
      abi: nftMarketplaceAbi,
      contractAddress: marketplaceAddress,
      functionName: 'listItem',
      params: {
        nftAddress,
        tokenId,
        price,
      },
    };

    await runContractFunction({
      params: listOptions,
      onSuccess: () => handleListSuccess(),
      onError: (err) => console.log(err),
    });
  };

  return (
    <div>
      <Form
        onSubmit={approveAndList}
        data={[
          {
            name: 'NFT Address',
            type: 'text',
            inputWidth: '50%',
            value: '',
            key: 'nftAddress',
          },
          {
            name: 'Token ID',
            type: 'number',
            value: '',
            key: 'tokenId',
          },
          {
            name: 'Price (ETH)',
            type: 'number',
            value: '',
            key: 'price',
          },
        ]}
        title="Sell NFT"
        id="mainForm"
      />
    </div>
  );
}
