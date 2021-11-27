pragma solidity ^0.8.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../src/contracts/Kiddies.sol";

contract TestContract{

  function testDefaultValue() public {
    kiddies _contract = kiddies(DeployedAddresses.kiddies());

    Assert.equal(_contract.isPresaleActive(), false, "Presale should not be enable");
    Assert.equal(_contract.isSaleActive(), false, "Sale should not be enable");
  }
}
