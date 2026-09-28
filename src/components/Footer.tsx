import logoWhite from "../assets/logo-white.png";

export default function Footer() {
  return (
    <footer className="border-t border-secondary-100 bg-secondary-500 py-10">
      <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-10 xl:px-20">
        <img src={logoWhite} alt="Superatom AI" className="h-5 w-auto" />
        <p className="text-xs text-white/60">
          © {new Date().getFullYear()} Superatom AI. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
