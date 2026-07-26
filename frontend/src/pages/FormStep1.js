import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Shell from "../components/Shell";
import StyledSelect from "../components/StyledSelect";

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

export default function FormStep1() {
  const navigate = useNavigate();
  const saved = JSON.parse(sessionStorage.getItem("esc_step1") || "{}");
  const [form, setForm] = useState({
    tipo: saved.tipo || "",
    localidade: saved.localidade || "",
    vivencia: saved.vivencia || "",
    tempo: saved.tempo || "",
  });

  const update = (key, val) => setForm((f) => ({ ...f, [key]: val }));

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
                  onValueChange={(v) => update(field.key, v)}
                  options={field.options}
                />
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
    </Shell>
  );
}
