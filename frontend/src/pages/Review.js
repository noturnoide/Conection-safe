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
      <section className="max-w-3xl mx-auto px-6 py-12 md:py-16">
        <div className="flex items-end justify-between mb-3">
          <h2 className="font-head text-3xl md:text-4xl font-medium tracking-tight text-white">
            Revisão de relatos
          </h2>
          <button
            data-testid="refresh-reports-btn"
            onClick={load}
            className="inline-flex items-center gap-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white text-sm px-4 py-2 transition-colors"
          >
            <RefreshCw className="w-4 h-4" /> Atualizar
          </button>
        </div>
        <p className="text-slate-400 mb-10">
          Todos os relatos recebidos, com seus protocolos anônimos, para fins de revisão.
        </p>

        {loading ? (
          <div className="flex items-center justify-center py-24 text-white/50">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : reports.length === 0 ? (
          <div
            data-testid="empty-reports"
            className="rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-2xl p-16 text-center text-white/50"
          >
            <Inbox className="w-10 h-10 mx-auto mb-4 text-white/30" />
            Nenhum relato recebido ainda.
          </div>
        ) : (
          <div className="space-y-6" data-testid="reports-list">
            <p className="text-sm text-white/40">{reports.length} relato(s)</p>
            {reports.map((r, i) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.5 }}
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
