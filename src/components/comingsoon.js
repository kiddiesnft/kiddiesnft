import KiddiesLogo from "../images/kiddies.png";
import TwitterLogo from "../images/twitter/Logowhite.svg";
import ComingSoonGif from "../images/comingsoon.gif";

function ComingSoon() {
  return (
    <div className="coming-soon">
      <img src={KiddiesLogo} alt="logo" className="coming-soon-logo" />
      <img src={ComingSoonGif} alt="coming soon" className="coming-soon-gif"/>
      <a
        href="https://twitter.com/kiddiesnft"
        target="_blank"
        rel="noreferrer"
        className="coming-soon-social-media mt-5"
      >
        <img src={TwitterLogo} alt="twitter" />
      </a>
    </div>
  );
}

export default ComingSoon;
