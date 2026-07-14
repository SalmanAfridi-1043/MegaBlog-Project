import { useLocation } from "react-router-dom";

function Footer() {
  const { pathname } = useLocation();

  // Show footer only on the home page
  if (pathname !== "/") return null;

  return (
    <footer className="bg-slate-950 border-t border-slate-800/60 py-4">
      <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
        <span>&copy; {new Date().getFullYear()} MegaBlog. All rights reserved.</span>
        <span className="hidden sm:block text-slate-700">·</span>
        <span>Built with React &amp; Appwrite</span>
      </div>
    </footer>
  );
}

export default Footer;
