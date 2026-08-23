import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Inbox, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import Shell from "../components/Shell";
import ReportDetail from "../components/ReportDetail";
import { listReports } from "../lib/api";

export default function Review() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const data = await listReports();
      setReports(data);
    } catch {
      toast.error("Não foi possível carregar os relatos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <Shell testid="review-page">
      <section className="container px-6 py-5" style={{ maxWidth: "52rem", paddingTop: "3rem", paddingBottom: "4rem" }}>
        <div className="d-flex align-items-end justify-content-between mb-3 flex-wrap gap-3">
          <h2 className="fs-1 fw-medium mb-0" style={{ color: "#0B1E3F", letterSpacing: "-0.02em", lineHeight: 1.15 }}>
            Revisão de relatos
          </h2>
          <button
            data-testid="refresh-reports-btn"
            onClick={load}
            className="btn btn-sm rounded-pill d-inline-flex align-items-center gap-2 px-3 py-2"
            style={{ backgroundColor: "#F1F4FA", color: "#0B1E3F", border: "1px solid rgba(11,30,63,0.10)" }}
          >
            <RefreshCw className="w-4 h-4" /> Atualizar
          </button>
        </div>
        <p className="mb-5 fs-6" style={{ color: "#6B7A99" }}>
          Todos os relatos recebidos, com seus protocolos anônimos, para fins de revisão.
        </p>

        {loading ? (
          <div className="d-flex align-items-center justify-content-center py-5" style={{ color: "#6B7A99" }}>
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : reports.length === 0 ? (
          <div
            data-testid="empty-reports"
            className="bg-white p-5 text-center"
            style={{
              border: "1px solid rgba(11,30,63,0.08)",
              borderRadius: "1.75rem",
              color: "#6B7A99",
            }}
          >
            <Inbox className="w-10 h-10 mx-auto mb-3" style={{ color: "#94A3B8" }} />
            Nenhum relato recebido ainda.
          </div>
        ) : (
          <div data-testid="reports-list">
            <p className="small mb-3" style={{ color: "#6B7A99" }}>{reports.length} relato(s)</p>
            {reports.map((r, i) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.5 }}
                className="mb-4"
              >
                <ReportDetail report={r} />
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </Shell>
  );
}
