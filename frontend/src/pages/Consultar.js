import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Shell from "../components/Shell";
import { getReport } from "../lib/api";
import ReportDetail from "../components/ReportDetail";

const inputStyle = {
  borderRadius: "2rem",
  padding: "1rem 1.5rem",
  fontSize: "1rem",
  border: "1px solid rgba(11,30,63,0.10)",
  color: "#0B1E3F",
  backgroundColor: "#fff",
  fontFamily: "'Roboto Mono', monospace",
  letterSpacing: "0.15em",
};

export default function Consultar() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);

  const search = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;
    try {
      setLoading(true);
      setReport(null);
      const data = await getReport(code.trim().toUpperCase());
      setReport(data);
    } catch {
      toast.error("Protocolo não encontrado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Shell testid="consultar-page">
      <section className="container px-6 py-5" style={{ maxWidth: "42rem", paddingTop: "3rem", paddingBottom: "4rem" }}>
        <h2 className="fs-1 fw-medium mb-3" style={{ color: "#0B1E3F", letterSpacing: "-0.02em", lineHeight: 1.15 }}>
          Consultar protocolo
        </h2>
        <p className="mb-5 fs-6" style={{ color: "#6B7A99" }}>
          Digite o código anônimo que você recebeu ao enviar o relato.
        </p>

        <form onSubmit={search} className="d-flex flex-column flex-sm-row gap-3 mb-5">
          <input
            data-testid="protocol-input"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="ESC-XXXX-XXXX"
            className="form-control shadow-sm flex-grow-1"
            style={inputStyle}
          />
          <button
            type="submit"
            data-testid="search-protocol-btn"
            disabled={loading}
            className="btn rounded-pill px-4 py-3 fw-medium d-inline-flex align-items-center justify-content-center gap-2"
            style={{ backgroundColor: "#0B1E3F", color: "#fff", border: "none", opacity: loading ? 0.6 : 1 }}
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
            Buscar
          </button>
        </form>

        {report && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <ReportDetail report={report} />
          </motion.div>
        )}
      </section>
    </Shell>
  );
}
