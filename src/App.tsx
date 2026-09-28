import Header from "./components/Header";
import Hero from "./components/Hero";
import Infrastructure from "./components/Infrastructure";

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />
        <Infrastructure />
      </main>
    </div>
  );
}

export default App;
