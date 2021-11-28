import "./App.css";
import NavAppBar from "./components/nav/Nav.js";
import MintForm from "./components/web3/MintForm.js";
import FAQ from "./components/faq.js"
import Team from "./components/team.js"
import Roadmap from "./components/roadmap.js"

function App() {
  return (
    <div className="App">
      <NavAppBar />
      <header className="App-header">
      </header>
      <section id="mint">
        <MintForm />
      </section>
      <section id="roadmap">
        <Roadmap/>
      </section>
      <section id="team">
        <Team/>
      </section>
      <section id="faq">
        <FAQ/>
      </section>
      <footer>
        Created by Kiddies LLC
      </footer>
    </div>
  );
}

export default App;
