import { ReactLenis } from "lenis/react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import About from "./pages/About";
import InventoryIntelligence from "./pages/InventoryIntelligence";
import ProcurementIntelligence from "./pages/ProcurementIntelligence";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <ReactLenis root>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route
              path="/solutions/inventory-intelligence"
              element={<InventoryIntelligence />}
            />
            <Route
              path="/solutions/procurement-intelligence"
              element={<ProcurementIntelligence />}
            />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ReactLenis>
  );
}

export default App;
