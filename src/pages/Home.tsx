import Hero3 from "../components/Hero3";
import HowItWorks from "../components/HowItWorks";
// Infrastructure section temporarily hidden from the page.
// import Infrastructure from "../components/Infrastructure";
import Testimonial from "../components/Testimonial";
import Customers from "../components/Customers";

export default function Home() {
  return (
    <>
      <Hero3 />
      <HowItWorks />
      {/* <Infrastructure /> */}
      <Customers />
      <Testimonial />
    </>
  );
}
