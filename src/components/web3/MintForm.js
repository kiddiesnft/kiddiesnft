import React from "react";
import Contract from "../../abis/Kiddies.json";
import Web3 from "web3";

const isWebPageReady = false;

class MintForm extends React.Component {
  async componentDidMount() {
    await this.loadWeb3();
  }

  constructor(props) {
    super(props);
    this.state = {
      currentAccount: "",
      contract: null,
      contractAddress: "",
      preSalePricePerToken: 0,
      pricePerToken: 0,
      totalSupply: 0,
      maxSupply: 0,
      preSaleEnabled: false,
      presaleMaxMintAllowed: 0,
      saleEnabled: false,
      maxMintAllowed: 1,
    };
    this.handleAccountsChanged = this.handleAccountsChanged.bind(this);
    this.connect = this.connect.bind(this);
    this.mintPresale = this.mintPresale.bind(this);
    this.mintSale = this.mintSale.bind(this);
  }

  async handleContractState(accounts) {
    const ethereum = window.ethereum;
    const web3 = window.web3;
    const networkId = await web3.eth.net.getId();
    const networkData = Contract.networks[networkId];
    if (networkData) {
      const abi = Contract.abi;
      const contractAddress = networkData.address;
      const currentAccount = accounts[0];

      const contract = new web3.eth.Contract(abi, contractAddress);
      const totalSupply = await contract.methods.totalSupply().call();
      const maxSupply = await contract.methods.MAX_SUPPLY().call();
      const preSalePricePerToken = await contract.methods
        .PRICE_PER_TOKEN()
        .call();
      const pricePerToken = await contract.methods.PRICE_PER_TOKEN().call();
      const maxMint = await contract.methods.MAX_PUBLIC_MINT().call();
      const preSaleEnabled = await contract.methods.isPresaleActive().call();
      const saleEnabled = await contract.methods.isSaleActive().call();
      const presaleMaxMint = await contract.methods
        .numAvailableToMint(currentAccount)
        .call();

      this.setState({
        currentAccount,
        contract,
        totalSupply,
        maxSupply,
        contractAddress: contractAddress,
        preSalePricePerToken,
        pricePerToken,
        presaleMaxMintAllowed: parseInt(presaleMaxMint),
        preSaleEnabled,
        saleEnabled,
        maxMintAllowed: parseInt(maxMint),
      });
    } else {
      console.log(
        `Smart contract is not deployed to this network ${networkId}`
      );
    }
    ethereum.on("accountsChanged", this.handleAccountsChanged);
    ethereum.on("chainChanged", this.handleChainChanged);
  }

  async loadWeb3() {
    if (typeof window.ethereum !== "undefined") {
      const ethereum = window.ethereum;
      window.web3 = new Web3(ethereum);
      const accounts = await window.web3.eth.getAccounts();
      if (accounts.length > 0) {
        await this.handleContractState(accounts);
      }
    } else {
      // create a component to ask user to download metamask
      console.log("Metamask is not install");
    }
  }

  async handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
      this.setState({
        currentAccount: undefined,
      });
    } else if (this.state.currentAccount !== accounts[0]) {
      await this.handleContractState(accounts);
    }
  }

  async mintPresale(qty) {
    const preSaleMintData = await this.state.contract.methods
      .mintPresale(qty)
      .encodeABI();
    const ethValue = Web3.utils.toHex(this.state.preSalePricePerToken * qty);
    this.mint(preSaleMintData, qty, ethValue);
  }

  async mintSale(qty) {
    const mintData = await this.state.contract.methods.mint(qty).encodeABI();
    const ethValue = Web3.utils.toHex(this.state.pricePerToken * qty);
    this.mint(mintData, qty, ethValue);
  }

  mint(data_, qty_, ethValue_) {
    if (
      this.state.currentAccount === undefined ||
      this.state.currentAccount === ""
    ) {
      return;
    }

    const params = [
      {
        from: this.state.currentAccount,
        to: this.state.contractAddress,
        value: ethValue_,
        data: data_,
      },
    ];

    window.ethereum
      .request({
        method: "eth_sendTransaction",
        params,
      })
      .then((result) => {
        // TODO replace with toast
        alert(`Request has been sent for ${data_} Angry Babies Club`);
        if (this.state.preSaleEnabled) {
          this.setState({
            presaleMaxMintAllowed: this.state.presaleMaxMintAllowed - qty_,
          });
        }
      })
      .catch((error) => {
        // TODO replace with toast
        console.log(`We could not process your transaction`);
      });
  }

  connect() {
    if (
      this.state.currentAccount !== undefined &&
      this.state.currentAccount !== ""
    ) {
      this.handleAccountsChanged([this.state.currentAccount]);
      return;
    }

    window.ethereum
      .request({ method: "eth_requestAccounts" })
      .then(this.handleAccountsChanged)
      .catch((err) => {
        // TODO replace with toast
        console.log(`error has occurred - reconnect Metamask`);
      });
  }

  handleChainChanged(_chainId) {
    window.location.reload();
  }

  createForm(isPresale, maxMintAllowed) {
    const mintButton = isPresale ? "Mint Presale" : "Mint";
    const remainingToken = this.state.maxSupply - this.state.totalSupply;

    if (remainingToken) {
      return (
        <div className="container">
          <div className="row">
            <div className="col text-center">
              <button className="btn btn-lg btn-primary" disabled>
                Sold out
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="MintForm">
        <h3>Remaining Tokens: {remainingToken}</h3>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            const qty =
              this.qty === "" || this.qty === undefined ? 1 : this.qty;
            isPresale ? this.mintPresale(qty) : this.mintSale(qty);
          }}
        >
          <div className="form-group">
            <label htmlFor="tokenQty">Quantity:</label>
            <select
              id="tokenQty"
              className="form-control form-control"
              onChange={(event) => {
                this.qty = event.target.value;
              }}
            >
              {[...Array(maxMintAllowed)].map((x, i) => (
                <option value={++i} key={i}>
                  {i}
                </option>
              ))}
            </select>
          </div>
          <input
            type="submit"
            className="btn btn-lg btn-primary"
            value={mintButton}
          />
        </form>
      </div>
    );
  }

  render() {
    if (!isWebPageReady) {
      return <div className="container"></div>;
    }

    if (
      this.state.currentAccount === undefined ||
      this.state.currentAccount === ""
    ) {
      return (
        <div className="container">
          <div className="row">
            <div className="col text-center">
              <button className="btn btn-lg btn-primary" onClick={this.connect}>
                Connect Wallet
              </button>
            </div>
          </div>
        </div>
      );
    }

    const presaleMaxMint = this.state.presaleMaxMintAllowed;
    if (this.state.saleEnabled) {
      return this.createForm(false, this.state.maxMintAllowed);
    } else if (this.state.preSaleEnabled && presaleMaxMint > 0) {
      return this.createForm(true, presaleMaxMint);
    }
    return (
      <div className="container">
        <div className="row">
          <div className="col text-center">
            <button className="btn btn-lg btn-primary" disabled>
              Mint Coming Soon
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default MintForm;
