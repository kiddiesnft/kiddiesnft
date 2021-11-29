// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract Kiddies is ERC721Enumerable, Ownable {

  uint public constant PRICE_PER_TOKEN = 0.09 ether;
  uint public constant MAX_SUPPLY = 10000;
  uint public constant MAX_PUBLIC_MINT = 10;

  string public provenance;
  uint public kiddieStartIndex;

  bool public isPresaleActive;
  bool public isSaleActive;
  
  string private _baseURIExtended;

  mapping(address => uint) private _presaleList;

  constructor() ERC721("Kiddies", "KIDDIES") {
    kiddieStartIndex = uint(block.number % MAX_SUPPLY);
  }

  function setPresaleState(bool _isPresaleActive) external onlyOwner {
    isPresaleActive = _isPresaleActive;
  }

  function setPresaleList(address[] calldata addresses, uint numAllowedToMint) external onlyOwner {
    for (uint i = 0; i < addresses.length; i++) {
        _presaleList[addresses[i]] = numAllowedToMint;
    }
  }

  function numAvailableToMint(address addr) external view returns (uint) {
    return _presaleList[addr];
  }

  function mintPresale(uint numberOfTokens) external payable {
    uint totalSupply = totalSupply();
    require(isPresaleActive, "Presale is not active");
    require(numberOfTokens <= _presaleList[msg.sender], "Exceeded number of mints allowed for presale");
    require(totalSupply + numberOfTokens <= MAX_SUPPLY, "Purchase would exceed max supply");
    require(PRICE_PER_TOKEN * numberOfTokens <= msg.value, "Ether value sent incorrect");

    _presaleList[msg.sender] -= numberOfTokens;
    for (uint i = 0; i < numberOfTokens; i++) {
        _safeMint(msg.sender, totalSupply + i);
    }
  }

  function setBaseURI(string memory baseURI_) external onlyOwner {
    _baseURIExtended = baseURI_;
  }

  function _baseURI() internal view virtual override returns (string memory) {
    return _baseURIExtended;
  }

  function setProvenance(string memory provenance_) public onlyOwner {
    provenance = provenance_;
  }

  function reserve(uint numberOfTokens) public onlyOwner {
    uint totalSupply = totalSupply();
    for (uint i = 0; i < numberOfTokens; i++) {
        _safeMint(msg.sender, totalSupply + i);
    }
  }

  function setSaleState(bool _isSaleActive) public onlyOwner {
    isSaleActive = _isSaleActive;
  }

  function mint(uint numberOfTokens) public payable {
    uint totalSupply = totalSupply();
    require(isSaleActive, "Sale must be active in order to mint");
    require(numberOfTokens <= MAX_PUBLIC_MINT, "Exceeded number of mints allowed");
    require(totalSupply + numberOfTokens <= MAX_SUPPLY, "Purchase would exceed max supply");
    require(PRICE_PER_TOKEN * numberOfTokens <= msg.value, "Ether value sent is incorrect");

    for (uint i = 0; i < numberOfTokens; i++) {
        _safeMint(msg.sender, totalSupply + i);
    }
  }

  function withdraw() public onlyOwner {
    uint balance = address(this).balance;
    payable(msg.sender).transfer(balance);
  }
}