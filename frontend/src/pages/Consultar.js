import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Shell from "../components/Shell";
import { getReport } from "../lib/api";
import ReportDetail from "../components/ReportDetail";

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
      <section className="max-w-2xl mx-auto px-6 py-12 md:py-16">
        <h2 className="font-head text-3xl md:text-4xl font-medium tracking-tight text-white mb-3">
          Consultar protocolo
        </h2>
        <p className="text-slate-400 mb-10">
          Digite o código anônimo que você recebeu ao enviar o relato.
        </p>

        <form onSubmit={search} className="flex flex-col sm:flex-row gap-4 mb-12">
          <input
            data-testid="protocol-input"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="ESC-XXXX-XXXX"
            className="flex-1 rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-md px-6 py-4 text-base text-white placeholder:text-white/30 font-mono tracking-widest focus:outline-none focus:ring-4 focus:ring-[#34D399]/10 focus:border-[#34D399]/50 transition-colors"
          />
          <button
            type="submit"
            data-testid="search-protocol-btn"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#34D399] text-[#042F2E] font-medium px-8 py-4 hover:bg-[#10B981] transition-colors active:scale-[0.98] disabled:opacity-60"
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
