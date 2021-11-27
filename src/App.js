import "./App.css";
import NavAppBar from "./components/nav/Nav.js";
import MintForm from "./components/web3/MintForm.js";

function App() {
  return (
    <div className="App" class="ms-5 me-5">
      {/* <NavAppBar /> */}
      <header className="App-header">
      </header>
      <section id="mint">
        <MintForm />
      </section>
      <section id="learn">
        Learn
      </section>
      <section id="roadmap">
        Roadmap
      </section>
      <section id="team">
        Team
      </section>
      <section id="faq">
        FAQ
      </section>
      <footer></footer>
    </div>
  );
}

export default App;
