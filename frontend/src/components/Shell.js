import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

// Full-page wrapper with the signature green + navy mesh gradient and grain.
export default function Shell({ children, showNav = true, testid }) {
  const location = useLocation();
  return (
    <div className="esc-mesh esc-grain min-h-screen relative" data-testid={testid}>
      {showNav && (
        <header className="relative z-20">
          <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 py-6">
            <Link
              to="/"
              data-testid="nav-home-link"
              className="flex items-center gap-2 text-white/90 hover:text-white transition-colors"
            >
              <ShieldCheck className="w-5 h-5 text-[#34D399]" />
              <span className="font-head text-lg tracking-tight">Canal de Escuta</span>
            </Link>
            <div className="flex items-center gap-6 text-sm">
              <Link
                to="/consultar"
                data-testid="nav-consultar-link"
                className={`transition-colors ${
                  location.pathname === "/consultar" ? "text-[#34D399]" : "text-white/60 hover:text-white"
                }`}
              >
                Consultar protocolo
              </Link>
              <Link
                to="/revisao"
                data-testid="nav-revisao-link"
                className={`transition-colors ${
                  location.pathname === "/revisao" ? "text-[#34D399]" : "text-white/60 hover:text-white"
                }`}
              >
                Revisão
              </Link>
            </div>
          </nav>
        </header>
      )}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10"
      >
        {children}
      </motion.main>
    </div>
  );
}
