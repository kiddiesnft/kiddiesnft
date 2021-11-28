import React from "react";
import FounderImage from "../images/kiddies.png";

class Team extends React.Component {
  render() {
    return (
      <div>
        <h1 className="header">Team</h1>
        <section className="team">
          <div className="team-member">
            <h5>Founder | Artist</h5>
            <img src={FounderImage} width="250" height="250" alt="Founder" />
            <p>@littlenftgirl</p>
          </div>
          <div className="team-member">
            <h5>Tech Director</h5>
            <img src={FounderImage} width="250" height="250" alt="Founder" />
            <p>@ikweezer</p>
          </div>
        </section>
      </div>
    );
  }
}

export default Team;
