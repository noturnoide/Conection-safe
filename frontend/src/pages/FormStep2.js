import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Plus, X, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Shell from "../components/Shell";
import StyledSelect from "../components/StyledSelect";
import { Textarea } from "../components/ui/textarea";
import { createReport } from "../lib/api";

const CARGOS = ["Aluno", "Limpeza", "Professor", "Coordenação"];
const TURMAS = [
  "Não consigo informar",
  "1A", "1B", "1C", "1D",
  "2A", "2B", "2C", "2D",
  "3A", "3B", "3C", "3D",
];

export default function FormStep2() {
  const navigate = useNavigate();
  const [detalhes, setDetalhes] = useState("");
  const [denunciados, setDenunciados] = useState([{ cargo: "", turma: "", nome: "" }]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const step1 = sessionStorage.getItem("esc_step1");
    if (!step1) {
      toast.info("Comece pelo início do questionário.");
      navigate("/relatar");
    }
  }, [navigate]);

  const addDenunciado = () =>
    setDenunciados((d) => [...d, { cargo: "", turma: "", nome: "" }]);

  const removeDenunciado = (idx) =>
    setDenunciados((d) => d.filter((_, i) => i !== idx));

  const updateDenunciado = (idx, key, val) =>
    setDenunciados((d) =>
      d.map((item, i) =>
        i === idx
          ? { ...item, [key]: val, ...(key === "cargo" && val !== "Aluno" ? { turma: "" } : {}) }
          : item
      )
    );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!detalhes.trim()) {
      toast.error("Conte-nos o que aconteceu.");
      return;
    }
    const step1 = JSON.parse(sessionStorage.getItem("esc_step1") || "{}");
    const payload = {
      ...step1,
      detalhes: detalhes.trim(),
      denunciados: denunciados
        .filter((d) => d.cargo || (d.nome && d.nome.trim()))
        .map((d) => ({
          cargo: d.cargo,
          turma: d.cargo === "Aluno" ? d.turma || null : null,
          nome: d.nome && d.nome.trim() ? d.nome.trim() : null,
        })),
    };
    try {
      setSubmitting(true);
      const report = await createReport(payload);
      sessionStorage.removeItem("esc_step1");
      sessionStorage.setItem("esc_protocolo", report.protocolo);
      navigate("/protocolo");
    } catch (err) {
      toast.error("Não foi possível enviar. Tente novamente.");
      setSubmitting(false);
    }
  };

  return (
    <Shell testid="form-step2-page">
      <section className="max-w-2xl mx-auto px-6 py-12 md:py-16">
        <button
          data-testid="back-step1-btn"
          onClick={() => navigate("/relatar")}
          className="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar à etapa 1
        </button>

        <div className="mb-2 text-xs tracking-[0.3em] uppercase font-semibold text-[#34D399]">
          Etapa 2 de 2
        </div>
        <h2 className="font-head text-3xl md:text-4xl font-medium tracking-tight text-white mb-3">
          Detalhes do relato
        </h2>
        <p className="text-slate-400 mb-10">Quanto mais detalhes, melhor poderemos ajudar. Continua anônimo.</p>

        <form onSubmit={handleSubmit} className="space-y-10">
          <div>
            <label className="block mb-1 font-medium text-white">
              Nos conte o que aconteceu e lembre-se de informar todos os detalhes
            </label>
            <p className="text-xs text-white/40 mb-3">Escreva livremente.</p>
            <Textarea
              data-testid="detalhes-textarea"
              value={detalhes}
              onChange={(e) => setDetalhes(e.target.value)}
              rows={6}
              placeholder="Descreva a situação..."
              className="w-full rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-md px-6 py-4 text-base text-white placeholder:text-white/30 focus-visible:ring-4 focus-visible:ring-[#34D399]/10 focus-visible:border-[#34D399]/50 transition-colors duration-300 resize-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="font-medium text-white">Pessoas envolvidas</label>
              <button
                type="button"
                data-testid="add-denunciado-btn"
                onClick={addDenunciado}
                className="inline-flex items-center gap-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white text-sm px-4 py-2 transition-colors"
              >
                <Plus className="w-4 h-4" /> Adicionar
              </button>
            </div>

            <div className="space-y-4">
              <AnimatePresence initial={false}>
                {denunciados.map((d, idx) => (
                  <motion.div
                    key={idx}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    data-testid={`denunciado-card-${idx}`}
                    className="rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-2xl p-6 relative"
                  >
                    {denunciados.length > 1 && (
                      <button
                        type="button"
                        data-testid={`remove-denunciado-${idx}`}
                        onClick={() => removeDenunciado(idx)}
                        aria-label="Remover pessoa envolvida"
                        className="absolute top-4 right-4 text-white/40 hover:text-[#34D399] transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                    <label className="block mb-3 text-sm text-white/80">
                      Indique o nome da pessoa envolvida <span className="text-white/40">(opcional)</span>
                    </label>
                    <input
                      type="text"
                      data-testid={`nome-input-${idx}`}
                      value={d.nome}
                      onChange={(e) => updateDenunciado(idx, "nome", e.target.value)}
                      placeholder="Nome (opcional)"
                      className="w-full rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-md px-6 py-4 text-base text-white placeholder:text-white/30 focus:outline-none focus:border-[#34D399]/50 focus:bg-white/10 focus:ring-4 focus:ring-[#34D399]/10 transition-colors duration-300 mb-5"
                    />

                    <label className="block mb-3 text-sm text-white/80">
                      Indique o cargo da pessoa envolvida
                    </label>
                    <StyledSelect
                      testid={`cargo-select-${idx}`}
                      value={d.cargo}
                      onValueChange={(v) => updateDenunciado(idx, "cargo", v)}
                      options={CARGOS}
                    />

                    <AnimatePresence>
                      {d.cargo === "Aluno" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.35 }}
                          className="overflow-hidden"
                        >
                          <label className="block mb-3 mt-5 text-sm text-white/80">
                            Qual a turma do aluno?
                          </label>
                          <StyledSelect
                            testid={`turma-select-${idx}`}
                            value={d.turma}
                            onValueChange={(v) => updateDenunciado(idx, "turma", v)}
                            options={TURMAS}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          <button
            type="submit"
            data-testid="submit-report-btn"
            disabled={submitting}
            className="group inline-flex items-center justify-center gap-3 rounded-full bg-[#34D399] text-[#042F2E] font-medium px-8 py-4 hover:bg-[#10B981] transition-colors active:scale-[0.98] disabled:opacity-60"
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Enviando...
              </>
            ) : (
              <>
                Enviar relato completo <Send className="w-5 h-5" />
              </>
            )}
          </button>
        </form>
      </section>
    </Shell>
  );
}
