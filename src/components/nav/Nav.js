import React from "react";
import TwitterIcon from "../../images/twitter/Logoblue.png";
import Kiddies from "../../images/kiddies.png";
import DiscordIcon from "../../images/discord/icon_clyde_blurple_RGB.png";

class NavAppBar extends React.Component {
  render() {
    return (
      <nav class="navbar navbar-light" id="nav">
      {/* TODO replace this with logo */}
        <a class="navbar-brand" href="#nav" rel="noreferrer">
          <img
            src={Kiddies}
            width="30"
            height="30"
            class="d-inline-block align-top ms-3 me-2"
            alt=""
          />
          Kiddies
        </a>
        <div class="float-right">
          <ul class="nav nav-pills">
            {/* <li class="nav-item">
              <a class="nav-link" href="#learn">
                Learn
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#roadmap">
                Roadmap
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#team">
                Team
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#faq">
                FAQ
              </a>
            </li> */}
            <li class="nav-item">
              <a class="nav-link" href="https://discord.gg/3tMpYsVHSh" target="_blank" rel="noreferrer">
                <img
                  src={DiscordIcon}
                  width="30"
                  height="30"
                  class="d-inline-block align-top"
                  alt="open discord"
                />
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="https://twitter.com/kiddies" target="_blank" rel="noreferrer">
                <img
                  src={TwitterIcon}
                  width="30"
                  height="30"
                  class="d-inline-block align-top "
                  alt="open twitter"
                />
              </a>
            </li>
            <li class="nav-item"></li>
          </ul>

          {/* <button class="btn btn-outline-success my-2 my-sm-0">Connect</button> */}
        </div>
      </nav>
    );
  }
}

export default NavAppBar;
