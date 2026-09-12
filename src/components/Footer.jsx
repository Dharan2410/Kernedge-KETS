import kernedgeLogo from "../assets/kernedge-logo.jpg";
import { CONTACT } from "../config";

export default function Footer() {
  return (
    <footer className="bg-ink border-t border-white/10 px-6 md:px-10 py-12">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div className="flex items-center gap-3">
          <img src={kernedgeLogo} alt="Kernedge" className="h-7 w-auto rounded-sm bg-white p-1" />
          <div>
            <p className="font-display font-bold text-paper">KETS<span className="text-gold">'26</span></p>
            <p className="text-paper/40 text-xs">KernEdge Technology &amp; Engineering Summit</p>
          </div>
        </div>

        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-paper/60">
          <a href="#about" className="hover:text-gold">About</a>
          <a href="#prize" className="hover:text-gold">Prize</a>
          <a href="#organizers" className="hover:text-gold">Organizers</a>
          <a href="#domains" className="hover:text-gold">Domains</a>
          <a href="#apply" className="hover:text-gold">Apply</a>
        </nav>

        <div className="text-sm text-paper/50 space-y-1">
          <p><a href={`mailto:${CONTACT.email}`} className="hover:text-gold">{CONTACT.email}</a></p>
          <p><a href={CONTACT.instagram} target="_blank" rel="noreferrer" className="hover:text-gold">@kernedge_</a></p>
        </div>
      </div>
      <p className="max-w-6xl mx-auto mt-10 pt-6 border-t border-white/5 text-xs text-paper/30">
        © {new Date().getFullYear()} Kernedge Pvt. Ltd. &amp; Startup Community Coimbatore. Built for KETS '26.
      </p>
    </footer>
  );
}
