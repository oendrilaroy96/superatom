import { lazy, Suspense } from "react";
import { ReactLenis } from "lenis/react";
import { LazyMotion, MotionConfig, domAnimation } from "motion/react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";

// Every page except the home page loads on demand, so the first visit downloads less.
const About = lazy(() => import("./pages/About"));
const InventoryIntelligence = lazy(
  () => import("./pages/InventoryIntelligence"),
);
const ProcurementIntelligence = lazy(
  () => import("./pages/ProcurementIntelligence"),
);
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const CaseStudies = lazy(() => import("./pages/CaseStudies"));
const CaseStudyDetail = lazy(() => import("./pages/CaseStudyDetail"));
const NotFound = lazy(() => import("./pages/NotFound"));

function App() {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <ReactLenis root>
          <BrowserRouter>
            <ScrollToTop />
            <Suspense fallback={null}>
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
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route
                    path="/terms-of-service"
                    element={<TermsOfService />}
                  />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:slug" element={<BlogPost />} />
                  <Route path="/case-studies" element={<CaseStudies />} />
                  <Route
                    path="/case-studies/:slug"
                    element={<CaseStudyDetail />}
                  />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </Suspense>
          </BrowserRouter>
        </ReactLenis>
      </MotionConfig>
    </LazyMotion>
  );
}

export default App;
