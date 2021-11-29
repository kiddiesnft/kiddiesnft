const { assert } = require('chai');
const Contract = artifacts.require("../src/contracts/Kiddies.sol");

require('Chai')
  .use(require('chai-as-promised'))
  .should();

contract("Contract", accounts => {

  let contract;
  let totalSupply;
  const pricePerToken = 90000000000000000; // .09 eth
  const baseUri = 'ipfs://PLACEHOLDER/'
  const maxMint = 10;
  const reserveCount = 50;
  const ownerAccount = accounts[0];
  const nonOwnerAccount = accounts[1];

  before(async() => {
    contract = await Contract.deployed()
  });

  describe('deployment', async() => {
    it('deploys sucessfully', async() => {
      const address = contract.address;
      assert.notEqual(address, undefined);
      assert.notEqual(address, '');
      assert.notEqual(address, 0x0);
      assert.notEqual(address, null);

      const owner = await contract.owner();
      assert.equal(owner, ownerAccount);
    });

    it('presale and sale is inactive', async() => {
      const totalSupply = await contract.totalSupply();
      assert.equal(totalSupply.toNumber(), 0);

      const isPresaleActive = await contract.isPresaleActive();
      assert.equal(isPresaleActive, false, 'preasle should be inactive')

      const isSaleActive = await contract.isSaleActive();
      assert.equal(isSaleActive, false, 'sale should be inactive')
    });
  });

  describe('setup before mint allowed', async() => {
    it('non owner cannot set provenance, uri, presale list, presale and sale state', async() => {
      await contract.setProvenance('hash', {from: nonOwnerAccount}).should.be.rejected;
      await contract.setPresaleState(true, {from: nonOwnerAccount}).should.be.rejected;
      await contract.setSaleState(true, {from: nonOwnerAccount}).should.be.rejected;
      await contract.setPresaleList([nonOwnerAccount], 5, {from: nonOwnerAccount}).should.be.rejected;
      await contract.withdraw({from: nonOwnerAccount}).should.be.rejected;
    });

    it('provenace is set', async() => {
      let provenance = await contract.provenance();
      assert.equal(provenance, '');

      const hash = "hashOfAllImages";
      await contract.setProvenance(hash);
      provenance = await contract.provenance();
      assert.equal(provenance, hash);
    });

    it('baseUri is set', async() => {
      await contract.setBaseURI(baseUri, {from: nonOwnerAccount}).should.be.rejected;
      // _baseURI() is internal only so 
      // we will verify it with the tokenUri in a later test
      await contract.setBaseURI(baseUri);
    });

    it('reserve tokens', async() => {
      totalSupply = await contract.totalSupply();
      assert.equal(totalSupply.toNumber(), 0, "initial totalSupply should be 0");

      // reserve only appropriate amount on the contract
      await contract.reserve(reserveCount);

      totalSupply = await contract.totalSupply();
      assert.equal(totalSupply.toNumber(), reserveCount);
    });
  });

  describe('minting', async() => {
    it(`cannot mint before active state`, async() => {
      await contract.mint(1, {from: ownerAccount, value: pricePerToken}).should.be.rejected;
      await contract.mintPresale(1, {from: ownerAccount, value: pricePerToken}).should.be.rejected;


      await contract.mint(1, {from: nonOwnerAccount, value: pricePerToken}).should.be.rejected;
      await contract.mintPresale(1, {from: nonOwnerAccount, value: pricePerToken}).should.be.rejected;
    });

    it('mint presale not allowed unless added in allowList', async() => {
      await contract.setPresaleState(true, {from: ownerAccount});

      // presale mint not allow until owner add them to presale list
      await contract.mintPresale(5, {from: nonOwnerAccount}).should.be.rejected;
    });

    it('mint presale', async() => {
      await contract.mintPresale(1, {from: nonOwnerAccount, value: pricePerToken}).should.be.rejected;

      //presale should be enable from above test
      const presaleActive = await contract.isPresaleActive();
      assert.equal(presaleActive, true);

      const preSaleMintCount = 10;

      await contract.setPresaleList([nonOwnerAccount], preSaleMintCount)
      // cannot mint more than allocated
      await contract.mintPresale(11, {from: nonOwnerAccount}).should.be.rejected;
      const mintAllowed = await contract.numAvailableToMint(nonOwnerAccount, {from: nonOwnerAccount});
      assert.equal(mintAllowed, preSaleMintCount)

      const mintCount = 6;
      const ethValue = pricePerToken * mintCount;
      await contract.mintPresale(1, {from: nonOwnerAccount, value: 0}).should.be.rejected;
      await contract.mintPresale(mintCount, {from: nonOwnerAccount, value: ethValue});

      totalSupply = await contract.totalSupply();
      assert.equal(totalSupply.toNumber(), reserveCount + mintCount);

      // non owner firstToken is 50 and last is 55 (we previously reserved 0-49)
      let nonOwnerToken = await contract.tokenOfOwnerByIndex(nonOwnerAccount, 0);
      assert.equal(nonOwnerToken.toNumber(), 50);
      nonOwnerToken = await contract.tokenOfOwnerByIndex(nonOwnerAccount, mintCount - 1);
      assert.equal(nonOwnerToken.toNumber(), 55);
    });

    it('tokenUri has correct baseUri', async() => {
      const tokenId = 0
      const tokenUri = await contract.tokenURI(tokenId);
      assert.equal(tokenUri, `${baseUri}${tokenId}`)
    });

    it('mint release', async() => {
      await contract.mint(1, {from: nonOwnerAccount, value: pricePerToken}).should.be.rejected;

      // set sale active
      await contract.setSaleState(true);
      await contract.mint(1, {from: nonOwnerAccount, value: 0}).should.be.rejected;
      await contract.mint(1, {from: nonOwnerAccount, value: pricePerToken});

      // cannot mint more than max allowed per transaction
      const mintAmount = maxMint + 1;
      await contract.mint(mintAmount, {from: nonOwnerAccount, value: (pricePerToken * mintAmount)}).should.be.rejected;
    });
  });
});
