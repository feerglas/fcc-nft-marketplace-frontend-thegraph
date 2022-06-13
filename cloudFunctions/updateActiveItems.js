// When an nft get's listed, it is active. When it is bought or canceled,
// we remove it from the active table.

Moralis.Cloud.afterSave('ItemListed', async (request) => {
  // every event gets triggered twice: once on unconfirmed, then on confirmed
  const confirmed = request.object.get('confirmed');
  const logger = Moralis.Cloud.getLogger();
  logger.info('---->>>> Looking for confirmed Tx');

  if (confirmed) {
    logger.info('---->>>> Found item');

    const ActiveItem = Moralis.Object.extend('ActiveItem');

    // .updateItem also emits the ItemListed event. Make sure this trigger
    // is not coming from there
    const query = new Moralis.Query(ActiveItem);
    query.equalTo('marketplaceAddress', request.object.get('address'));
    query.equalTo('nftAddress', request.object.get('nftAddress'));
    query.equalTo('tokenId', request.object.get('tokenId'));
    query.equalTo('seller', request.object.get('seller'));
    const alreadyListedItem = await query.first();
    if (alreadyListedItem) {
      logger.info(
        `---->>>> Deleting already listed ${request.object.get('tokenId')}.`
      );

      await alreadyListedItem.destroy();

      logger.info(
        `---->>>> Deleted item with tokenId ${request.object.get(
          'tokenId'
        )} at address ${request.object.get(
          'address'
        )} since it already has been listed.`
      );
    }

    const activeItem = new ActiveItem();
    activeItem.set('marketplaceAddress', request.object.get('address'));
    activeItem.set('nftAddress', request.object.get('nftAddress'));
    activeItem.set('price', request.object.get('price'));
    activeItem.set('tokenId', request.object.get('tokenId'));
    activeItem.set('seller', request.object.get('seller'));

    logger.info(
      `---->>>> Adding Address: ${request.object.get(
        'address'
      )}. TokenId: ${request.object.get('tokenId')}.`
    );
    logger.info('---->>>> Saving');
    await activeItem.save();
    logger.info('---->>>> Saved');
  }
});

Moralis.Cloud.afterSave('ItemCanceled', async (request) => {
  const confirmed = request.object.get('confirmed');
  const logger = Moralis.Cloud.getLogger();
  logger.info(`---->>>> Marketplace | Object: ${request.object}`);

  if (confirmed) {
    const ActiveItem = Moralis.Object.extend('ActiveItem');
    const query = new Moralis.Query(ActiveItem);
    query.equalTo('marketplaceAddress', request.object.get('address'));
    query.equalTo('nftAddress', request.object.get('nftAddress'));
    query.equalTo('tokenId', request.object.get('tokenId'));
    logger.info(`---->>>> Marketplace | Query: ${query}`);

    const canceledItem = await query.first();

    logger.info(`---->>>> Marketplace | Canceled item: ${canceledItem}`);

    if (canceledItem) {
      logger.info(
        `---->>>> Marketplace | Deleting: ${request.object.get(
          'tokenId'
        )} at address ${request.object.get('address')} since it was canceled`
      );

      await canceledItem.destroy();
    } else {
      logger.info(
        `---->>>> Marketplace | No item found with address ${request.object.get(
          'address'
        )} and tokenId ${request.object.get('tokenId')}`
      );
    }
  }
});

Moralis.Cloud.afterSave('ItemBought', async (request) => {
  const confirmed = request.object.get('confirmed');
  const logger = Moralis.Cloud.getLogger();
  logger.info(`---->>>> Marketplace | Object: ${request.object}`);

  if (confirmed) {
    const ActiveItem = Moralis.Object.extend('ActiveItem');
    const query = new Moralis.Query(ActiveItem);
    query.equalTo('marketplaceAddress', request.object.get('address'));
    query.equalTo('nftAddress', request.object.get('nftAddress'));
    query.equalTo('tokenId', request.object.get('tokenId'));
    logger.info(`---->>>> Marketplace | Query: ${query}`);

    const boughtItem = await query.first();

    logger.info(`---->>>> Marketplace | Canceled item: ${boughtItem}`);

    if (boughtItem) {
      logger.info(
        `---->>>> Marketplace | Deleting: ${request.object.get(
          'tokenId'
        )} at address ${request.object.get('address')} since it was bought`
      );

      await boughtItem.destroy();
    } else {
      logger.info(
        `---->>>> Marketplace | No item found with address ${request.object.get(
          'address'
        )} and tokenId ${request.object.get('tokenId')}`
      );
    }
  }
});
