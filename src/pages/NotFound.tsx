import { Link } from "react-router-dom";
import Button from "../components/ui/Button";

export default function NotFound() {
  return (
    <section className="flex flex-col items-center px-4 py-[120px] text-center">
      <p className="font-display text-h1 font-semibold text-heading">404</p>
      <p className="mt-2 max-w-sm text-sm text-body">
        We couldn&rsquo;t find the page you&rsquo;re looking for.
      </p>
      <Link to="/" className="mt-6">
        <Button variant="primary">Back to home</Button>
      </Link>
    </section>
  );
}
