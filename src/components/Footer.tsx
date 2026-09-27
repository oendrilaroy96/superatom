export default function Footer() {
  return (
    <footer className="border-t border-secondary-100 bg-white py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
        <p className="font-display text-sm font-semibold text-heading">
          Superatom <span className="text-primary-500">AI</span>
        </p>
        <p className="text-xs text-muted">
          © {new Date().getFullYear()} Superatom AI. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
