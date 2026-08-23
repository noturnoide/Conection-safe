import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Plus, X, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Shell from "../components/Shell";
import StyledSelect from "../components/StyledSelect";
import { createReport } from "../lib/api";

const CARGOS = ["Aluno", "Limpeza", "Professor", "Coordenação"];
const TURMAS = [
  "Não consigo informar",
  "1A", "1B", "1C", "1D",
  "2A", "2B", "2C", "2D",
  "3A", "3B", "3C", "3D",
];

const inputStyle = {
  borderRadius: "2rem",
  padding: "1rem 1.5rem",
  fontSize: "1rem",
  border: "1px solid rgba(11,30,63,0.10)",
  color: "#0B1E3F",
  backgroundColor: "#fff",
};

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
      <section className="container px-6 py-5" style={{ maxWidth: "42rem", paddingTop: "3rem", paddingBottom: "4rem" }}>
        <button
          data-testid="back-step1-btn"
          onClick={() => navigate("/relatar")}
          className="btn btn-link p-0 small text-decoration-none d-inline-flex align-items-center gap-2 mb-5"
          style={{ color: "#6B7A99" }}
        >
          <ArrowLeft className="w-4 h-4" /> Voltar à etapa 1
        </button>

        <div className="small text-uppercase fw-semibold mb-3" style={{ letterSpacing: "0.3em", color: "#1E3A8A" }}>
          Etapa 2 de 2
        </div>
        <h2 className="fs-1 fw-medium mb-3" style={{ color: "#0B1E3F", letterSpacing: "-0.02em", lineHeight: 1.15 }}>
          Detalhes do relato
        </h2>
        <p className="mb-5 fs-6" style={{ color: "#6B7A99" }}>Quanto mais detalhes, melhor poderemos ajudar. Continua anônimo.</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="form-label fw-medium mb-2 d-block" style={{ color: "#0B1E3F", fontSize: "1rem" }}>
              Nos conte o que aconteceu e lembre-se de informar todos os detalhes
            </label>
            <p className="small mb-3" style={{ color: "#6B7A99" }}>Escreva livremente.</p>
            <textarea
              data-testid="detalhes-textarea"
              value={detalhes}
              onChange={(e) => setDetalhes(e.target.value)}
              rows={6}
              placeholder="Descreva a situação..."
              className="form-control shadow-sm"
              style={{ ...inputStyle, resize: "none" }}
            />
          </div>

          <div className="mb-5">
            <div className="d-flex align-items-center justify-content-between mb-4">
              <label className="form-label fw-medium mb-0" style={{ color: "#0B1E3F", fontSize: "1rem" }}>Pessoas envolvidas</label>
              <button
                type="button"
                data-testid="add-denunciado-btn"
                onClick={addDenunciado}
                className="btn btn-sm rounded-pill d-inline-flex align-items-center gap-2 px-3 py-2"
                style={{ backgroundColor: "#F1F4FA", color: "#0B1E3F", border: "1px solid rgba(11,30,63,0.10)" }}
              >
                <Plus className="w-4 h-4" /> Adicionar
              </button>
            </div>

            <div>
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
                    className="bg-white position-relative mb-4"
                    style={{
                      border: "1px solid rgba(11,30,63,0.08)",
                      borderRadius: "1.75rem",
                      boxShadow: "0 10px 40px rgba(11,30,63,0.06)",
                      padding: "1.75rem",
                    }}
                  >
                    {denunciados.length > 1 && (
                      <button
                        type="button"
                        data-testid={`remove-denunciado-${idx}`}
                        onClick={() => removeDenunciado(idx)}
                        aria-label="Remover pessoa envolvida"
                        className="btn btn-sm position-absolute p-1"
                        style={{ top: "0.75rem", right: "0.75rem", color: "#6B7A99" }}
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                    <label className="form-label small d-block mb-2" style={{ color: "#334166" }}>
                      Indique o nome da pessoa envolvida <span style={{ color: "#94A3B8" }}>(opcional)</span>
                    </label>
                    <input
                      type="text"
                      data-testid={`nome-input-${idx}`}
                      value={d.nome}
                      onChange={(e) => updateDenunciado(idx, "nome", e.target.value)}
                      placeholder="Nome (opcional)"
                      className="form-control shadow-sm mb-4"
                      style={inputStyle}
                    />

                    <label className="form-label small d-block mb-2" style={{ color: "#334166" }}>
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
                          <label className="form-label small d-block mb-2 mt-4" style={{ color: "#334166" }}>
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
            className="btn rounded-pill px-4 py-3 fw-medium d-inline-flex align-items-center gap-2 mt-4"
            style={{ backgroundColor: "#0B1E3F", color: "#fff", border: "none", opacity: submitting ? 0.6 : 1 }}
            onMouseEnter={(e) => !submitting && (e.currentTarget.style.backgroundColor = "#142A55")}
            onMouseLeave={(e) => !submitting && (e.currentTarget.style.backgroundColor = "#0B1E3F")}
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
