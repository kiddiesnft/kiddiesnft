import React from "react";

class FAQ extends React.Component {
  render() {
    return (
      <div>
        <h1 class="header">FAQ</h1>
        <div class="questions">
          <div class="question">
            <h5>Q: What is NFT?</h5>
            <p>
              NFT stands for “non-fungible token.” It is a one-of-a-kind asset
              in the digital world that links ownership to property. This can be
              physical or digital property including a Kiddies art piece.
            </p>
          </div>
          <div class="question">
            <h5>Q: What is Metamask?</h5>
            <p>
              Metamask is a crypto wallet for your ETH. You will need this to
              mint a Kiddie. This will be where your Kiddie NFT will be stored.
              You can find more information at https://metamask.io/
            </p>
          </div>
          <div class="question">
            <h5>Q: Where does my NFT go after I purchase a Kiddie?</h5>
            <p>
              Your Kiddie NFT will be part of your Ethereum wallet. You can view
              them on opensea.io
            </p>
          </div>
          <div class="question">
            <h5>Q: What can I do with my Kiddie?</h5>
            <p>
              You are free to do anything with them under a non-exclusive
              license.
            </p>
          </div>
          <div class="question">
            <h5>Q: Are Kiddies a good investment?</h5>
            <p>
              Kiddies are meant to be NFT tokens to collect. We make no promise
              or guarantee. We give you our words to drive the community
              forward.
            </p>
          </div>
          <div class="question">
            <h5>Q: How will you make this fair?</h5>
            <p>
              10,000 Kiddies will be programmatically generated and hashed using
              SHA-256 algorithm. A combined string is obtained by concatenating
              SHA-256 of each Kiddie image. The final provenance record is
              obtained by SHA-256 hashing this combined string and will be
              stored on the smart contract before the allowlist sale starts.
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default FAQ;
