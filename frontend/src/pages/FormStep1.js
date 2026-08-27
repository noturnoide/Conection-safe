import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Icon from "../components/Icon";
import Shell from "../components/Shell";
import StyledSelect from "../components/StyledSelect";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../components/ui/dialog";

const FIELDS = [
  {
    key: "tipo",
    label: "Qual tipo de situação você gostaria de relatar?",
    hint: "Selecione entre os itens:",
    options: ["Assédio moral", "Assédio sexual", "Cyberbullying"],
  },
  {
    key: "localidade",
    label: "Localidade",
    hint: "Digite o local onde ocorreu:",
    type: "text",
    placeholder: "Ex.: Cinemi, Refeitório, Espaço maker...",
  },
  {
    key: "vivencia",
    label: "Foi algo que você vivenciou?",
    hint: "Selecione entre os itens:",
    options: ["Sim, eu vivenciei", "Não, soube de outra pessoa"],
  },
  {
    key: "tempo",
    label: "Quando o fato ocorreu?",
    hint: "Selecione entre os itens:",
    options: ["Hoje", "Ontem", "Semana passada", "Mês passado"],
  },
];

const TIPO_DESCRIPTIONS = {
  "Assédio moral":
    "*Exposição repetida ou sistemática a situações humilhantes, hostis ou degradantes*, como ofensas, ameaças, ridicularização, exclusão ou perseguição. *Racismo, homofobia, transfobia, capacitismo e outras formas de discriminação também podem ser relatados*, mesmo se ocorridas de forma isolada.",
  "Assédio sexual":
    "Comportamentos, comentários, mensagens ou abordagens *indesejadas de caráter ou conotação sexual*, como comentários sobre o corpo, propostas, toques sem consentimento ou exposição a conteúdo sexual. *Não é necessário contato físico ou repetição.*",
  Cyberbullying:
    "Humilhação, intimidação, perseguição ou exposição de alguém por *meios digitais, como redes sociais e aplicativos*, incluindo insultos, ameaças, boatos, divulgação de imagens sem consentimento ou perfis falsos.",
};

const OBSERVATION =
  "*Não sabe se a situação se encaixa? Relate mesmo assim.* O canal também acolhe casos de discriminação, violência, constrangimento ou outras situações que tenham causado desconforto ou sofrimento.";

const renderBold = (text) =>
  text.split(/(\*[^*]+\*)/g).map((part, i) =>
    part.startsWith("*") && part.endsWith("*") && part.length > 2 ? (
      <strong key={i} className="fw-semibold" style={{ color: "#0B1E3F" }}>
        {part.slice(1, -1)}
      </strong>
    ) : (
      <span key={i}>{part}</span>
    )
  );

export default function FormStep1() {
  const navigate = useNavigate();
  const saved = JSON.parse(sessionStorage.getItem("esc_step1") || "{}");
  const [form, setForm] = useState({
    tipo: saved.tipo || "",
    localidade: saved.localidade || "",
    vivencia: saved.vivencia || "",
    tempo: saved.tempo || "",
  });
  const [dialogTipo, setDialogTipo] = useState(null);

  const update = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleTipoChange = (v) => {
    update("tipo", v);
    if (TIPO_DESCRIPTIONS[v]) setDialogTipo(v);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const missing = FIELDS.find((f) => !form[f.key]);
    if (missing) {
      toast.error("Por favor, responda todas as perguntas.");
      return;
    }
    sessionStorage.setItem("esc_step1", JSON.stringify(form));
    navigate("/relatar/detalhes");
  };

  return (
    <Shell testid="form-step1-page">
      <section className="container px-6 py-5" style={{ maxWidth: "42rem", paddingTop: "3rem", paddingBottom: "4rem" }}>
        <button
          data-testid="back-home-btn"
          onClick={() => navigate("/")}
          className="btn btn-link p-0 small text-decoration-none d-inline-flex align-items-center gap-2 mb-5"
          style={{ color: "#6B7A99" }}
        >
          <Icon name="arrow-left" size={4} /> Voltar
        </button>

        <div className="small text-uppercase fw-semibold mb-3" style={{ letterSpacing: "0.3em", color: "#1E3A8A" }}>
          Etapa 1 de 2
        </div>
        <h2 className="fs-1 fw-medium mb-3" style={{ color: "var(--esc-ink)", letterSpacing: "-0.02em", lineHeight: 1.15 }}>
          Sobre a situação
        </h2>
        <p className="mb-5 fs-6" style={{ color: "#6B7A99" }}>Responda com sigilo total. Nada aqui identifica você.</p>

        <form onSubmit={handleSubmit}>
          {FIELDS.map((field, i) => (
            <motion.div
              key={field.key}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="mb-5"
            >
              <label className="form-label fw-medium mb-2 d-block" style={{ color: "var(--esc-ink)", fontSize: "1rem" }}>{field.label}</label>
              <p className="small mb-3" style={{ color: "#6B7A99" }}>{field.hint}</p>
              {field.type === "text" ? (
                <input
                  type="text"
                  data-testid={`input-${field.key}`}
                  value={form[field.key]}
                  onChange={(e) => update(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className="form-control shadow-sm"
                  style={{
                    borderRadius: "2rem",
                    padding: "1rem 1.5rem",
                    fontSize: "1rem",
                    border: "1px solid rgba(11,30,63,0.10)",
                    color: "var(--esc-ink)",
                    backgroundColor: "#fff",
                  }}
                />
              ) : (
                <StyledSelect
                  testid={`select-${field.key}`}
                  value={form[field.key]}
                  onValueChange={(v) =>
                    field.key === "tipo" ? handleTipoChange(v) : update(field.key, v)
                  }
                  options={field.options}
                />
              )}

              {field.key === "tipo" && (
                <div
                  data-testid="tipo-observation"
                  className="d-flex gap-3 p-4 mt-4"
                  style={{
                    border: "1px solid rgba(30,58,138,0.20)",
                    backgroundColor: "rgba(30,58,138,0.05)",
                    borderRadius: "1.25rem",
                  }}
                >
                  <Icon name="information-outline" size={5} style={{ color: "#1E3A8A", marginTop: "0.15rem", flexShrink: 0 }} />
                  <p className="mb-0 small lh-base" style={{ color: "#334166" }}>
                    {renderBold(OBSERVATION)}
                  </p>
                </div>
              )}
            </motion.div>
          ))}

          <button
            type="submit"
            data-testid="step1-next-btn"
            className="btn rounded-pill px-4 py-3 fw-medium d-inline-flex align-items-center gap-2 mt-4"
            style={{ backgroundColor: "#0B1E3F", color: "#fff", border: "none" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#142A55")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#0B1E3F")}
          >
            Continuar
            <Icon name="arrow-right" size={5} />
          </button>
        </form>
      </section>

      <Dialog open={!!dialogTipo} onOpenChange={(o) => !o && setDialogTipo(null)}>
        <DialogContent
          data-testid="tipo-dialog"
          className="rounded-4 bg-white"
          style={{
            border: "1px solid rgba(11,30,63,0.10)",
            color: "var(--esc-ink)",
            maxWidth: "32rem",
            borderRadius: "1.75rem",
          }}
        >
          <DialogHeader>
            <DialogTitle className="fs-3 fw-medium" style={{ color: "var(--esc-ink)" }}>
              {dialogTipo}
            </DialogTitle>
            <DialogDescription className="fs-6 lh-base mt-2" style={{ color: "#334166" }}>
              {dialogTipo && renderBold(TIPO_DESCRIPTIONS[dialogTipo])}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button
              data-testid="tipo-dialog-confirm"
              onClick={() => setDialogTipo(null)}
              className="btn rounded-pill px-4 py-2 fw-medium"
              style={{ backgroundColor: "#0B1E3F", color: "#fff", border: "none" }}
            >
              Entendi, continuar
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Shell>
  );
}
