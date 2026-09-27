export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
        <p className="text-sm font-semibold text-[#0a1929]">
          Superatom <span className="text-cyan-600">AI</span>
        </p>
        <p className="text-xs text-slate-400">
          © {new Date().getFullYear()} Superatom AI. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
