import Header from "./components/Header";
import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";
import Infrastructure from "./components/Infrastructure";
import SocialProof from "./components/SocialProof";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />
        <HowItWorks />
        <Infrastructure />
        <SocialProof />
      </main>
      <Footer />
    </div>
  );
}

export default App;
