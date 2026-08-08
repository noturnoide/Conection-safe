import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, Info } from "lucide-react";
import { toast } from "sonner";
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

// Splits *bold* segments into <strong>.
const renderBold = (text) =>
  text.split(/(\*[^*]+\*)/g).map((part, i) =>
    part.startsWith("*") && part.endsWith("*") && part.length > 2 ? (
      <strong key={i} className="text-white font-semibold">
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
      <section className="max-w-2xl mx-auto px-6 py-12 md:py-16">
        <button
          data-testid="back-home-btn"
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar
        </button>

        <div className="mb-2 text-xs tracking-[0.3em] uppercase font-semibold text-[#34D399]">
          Etapa 1 de 2
        </div>
        <h2 className="font-head text-3xl md:text-4xl font-medium tracking-tight text-white mb-3">
          Sobre a situação
        </h2>
        <p className="text-slate-400 mb-10">Responda com sigilo total. Nada aqui identifica você.</p>

        <form onSubmit={handleSubmit} className="space-y-8">
          {FIELDS.map((field, i) => (
            <motion.div
              key={field.key}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
            >
              <label className="block mb-1 font-medium text-white">{field.label}</label>
              <p className="text-xs text-white/40 mb-3">{field.hint}</p>
              {field.type === "text" ? (
                <input
                  type="text"
                  data-testid={`input-${field.key}`}
                  value={form[field.key]}
                  onChange={(e) => update(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-md px-6 py-4 text-base text-white placeholder:text-white/30 focus:outline-none focus:border-[#34D399]/50 focus:bg-white/10 focus:ring-4 focus:ring-[#34D399]/10 transition-colors duration-300"
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
                  className="mt-4 flex gap-3 rounded-2xl border border-[#34D399]/25 bg-[#34D399]/[0.06] backdrop-blur-md px-5 py-4"
                >
                  <Info className="w-5 h-5 text-[#34D399] shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-200 leading-relaxed">
                    {renderBold(OBSERVATION)}
                  </p>
                </div>
              )}
            </motion.div>
          ))}

          <button
            type="submit"
            data-testid="step1-next-btn"
            className="group inline-flex items-center justify-center gap-3 rounded-full bg-[#34D399] text-[#042F2E] font-medium px-8 py-4 hover:bg-[#10B981] transition-colors active:scale-[0.98]"
          >
            Continuar
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
      </section>

      <Dialog open={!!dialogTipo} onOpenChange={(o) => !o && setDialogTipo(null)}>
        <DialogContent
          data-testid="tipo-dialog"
          className="rounded-[2rem] border border-white/10 bg-[#0E1B2A]/95 backdrop-blur-2xl text-white max-w-lg"
        >
          <DialogHeader>
            <DialogTitle className="font-head text-2xl text-white">
              {dialogTipo}
            </DialogTitle>
            <DialogDescription className="text-slate-300 leading-relaxed text-base mt-2">
              {dialogTipo && renderBold(TIPO_DESCRIPTIONS[dialogTipo])}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button
              data-testid="tipo-dialog-confirm"
              onClick={() => setDialogTipo(null)}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#34D399] text-[#042F2E] font-medium px-6 py-3 hover:bg-[#10B981] transition-colors active:scale-[0.98]"
            >
              Entendi, continuar
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Shell>
  );
}
