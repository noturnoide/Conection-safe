import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

// Full-page wrapper with the white + dark navy mesh background.
export default function Shell({ children, showNav = true, testid }) {
  const location = useLocation();
  return (
    <div className="esc-mesh min-h-screen relative" data-testid={testid}>
      {showNav && (
        <header className="relative z-20">
          <nav className="container-xxl mx-auto flex items-center justify-between px-6 py-6" style={{ maxWidth: "72rem" }}>
            <Link
              to="/"
              data-testid="nav-home-link"
              className="d-flex align-items-center gap-2 text-decoration-none"
              style={{ color: "var(--esc-ink)" }}
            >
              <ShieldCheck className="w-5 h-5" style={{ color: "#1E3A8A" }} />
              <span className="fw-medium fs-5" style={{ letterSpacing: "-0.01em" }}>Canal de Escuta</span>
            </Link>
            <div className="d-flex align-items-center gap-4 small">
              <Link
                to="/consultar"
                data-testid="nav-consultar-link"
                className="text-decoration-none"
                style={{ color: location.pathname === "/consultar" ? "#1E3A8A" : "#6B7A99" }}
              >
                Consultar protocolo
              </Link>
              <Link
                to="/revisao"
                data-testid="nav-revisao-link"
                className="text-decoration-none"
                style={{ color: location.pathname === "/revisao" ? "#1E3A8A" : "#6B7A99" }}
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
