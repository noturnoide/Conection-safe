import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Copy, Check, ShieldCheck, Home } from "lucide-react";
import { toast } from "sonner";
import Shell from "../components/Shell";

export default function Protocol() {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const protocolo = sessionStorage.getItem("esc_protocolo");

  useEffect(() => {
    if (!protocolo) navigate("/");
  }, [protocolo, navigate]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(protocolo);
      setCopied(true);
      toast.success("Protocolo copiado.");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error("Não foi possível copiar.");
    }
  };

  if (!protocolo) return null;

  return (
    <Shell testid="protocol-page">
      <section className="container px-6 py-5 text-center d-flex flex-column align-items-center" style={{ maxWidth: "42rem", paddingTop: "4rem", paddingBottom: "4rem" }}>
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 18 }}
          className="rounded-circle d-flex align-items-center justify-content-center mb-4"
          style={{ width: "5rem", height: "5rem", backgroundColor: "rgba(30,58,138,0.10)", border: "1px solid rgba(30,58,138,0.25)" }}
        >
          <ShieldCheck className="w-9 h-9" style={{ color: "#1E3A8A" }} />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="fs-1 fw-medium mb-3"
          style={{ color: "#0B1E3F", letterSpacing: "-0.02em" }}
        >
          Obrigado por confiar em nós.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="lh-base mb-5"
          style={{ maxWidth: "30rem", color: "#334166" }}
        >
          Sua mensagem foi registrada de forma segura e anônima. Guarde o protocolo
          abaixo para acompanhar seu relato depois.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="w-100 bg-white p-4"
          style={{
            border: "1px solid rgba(11,30,63,0.08)",
            borderRadius: "1.75rem",
            boxShadow: "0 10px 40px rgba(11,30,63,0.10)",
            padding: "2.5rem",
          }}
        >
          <p className="small text-uppercase fw-semibold mb-3" style={{ letterSpacing: "0.3em", color: "#6B7A99" }}>
            Seu protocolo anônimo
          </p>
          <div
            data-testid="protocol-code"
            className="mb-4"
            style={{
              fontFamily: "'Roboto Mono', monospace",
              fontSize: "clamp(1.75rem, 5vw, 3rem)",
              letterSpacing: "0.15em",
              color: "#1E3A8A",
              wordBreak: "break-all",
            }}
          >
            {protocolo}
          </div>
          <button
            data-testid="copy-protocol-btn"
            onClick={copy}
            className="btn rounded-pill px-4 py-2 d-inline-flex align-items-center gap-2"
            style={{ backgroundColor: "#F1F4FA", color: "#0B1E3F", border: "1px solid rgba(11,30,63,0.10)" }}
          >
            {copied ? <Check className="w-5 h-5" style={{ color: "#1E3A8A" }} /> : <Copy className="w-5 h-5" />}
            {copied ? "Copiado" : "Copiar protocolo"}
          </button>
        </motion.div>

        <button
          data-testid="protocol-home-btn"
          onClick={() => navigate("/")}
          className="btn btn-link mt-4 d-inline-flex align-items-center gap-1 text-decoration-none"
          style={{ color: "#6B7A99" }}
        >
          <Home className="w-4 h-4" /> Voltar ao início
        </button>
      </section>
    </Shell>
  );
}
