import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, EyeOff, HeartHandshake, ArrowRight } from "lucide-react";
import Shell from "../components/Shell";

const heroLines = ["Você está", "seguro aqui."];

const wordReveal = {
  hidden: { y: "110%" },
  visible: (i) => ({
    y: "0%",
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 + i * 0.15 },
  }),
};

const chapters = [
  {
    n: "01",
    title: "Sigilo absoluto",
    text: "Nenhum nome, e-mail ou dado pessoal é solicitado. Seu relato é registrado sem qualquer vínculo com sua identidade.",
    icon: EyeOff,
  },
  {
    n: "02",
    title: "Um espaço protegido",
    text: "Este é um canal de escuta. Aqui você pode relatar assédio moral, assédio sexual ou cyberbullying com total tranquilidade.",
    icon: Lock,
  },
  {
    n: "03",
    title: "Estamos ouvindo",
    text: "Cada relato é lido com cuidado e respeito. Você recebe um protocolo anônimo para acompanhar, sem se expor.",
    icon: HeartHandshake,
  },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <Shell testid="landing-page">
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-24 md:pt-24 min-h-[78vh] flex flex-col justify-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="text-xs tracking-[0.3em] uppercase font-semibold text-[#34D399] mb-8"
        >
          Canal de Escuta Anônima
        </motion.p>

        <h1 className="font-head font-light text-5xl sm:text-6xl lg:text-7xl leading-[0.95] tracking-tighter text-white">
          {heroLines.map((line, i) => (
            <span key={i} className="block overflow-hidden py-1">
              <motion.span
                className="block"
                custom={i}
                variants={wordReveal}
                initial="hidden"
                animate="visible"
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.7 }}
          className="mt-8 max-w-xl text-lg text-slate-300 leading-relaxed"
        >
          Responda ao questionário abaixo com total sigilo. Este é um espaço seguro
          para relatar situações difíceis — sem nome, sem julgamento, sem exposição.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.7 }}
          className="mt-12 flex flex-col sm:flex-row gap-4"
        >
          <button
            data-testid="start-report-btn"
            onClick={() => navigate("/relatar")}
            className="group inline-flex items-center justify-center gap-3 rounded-full bg-[#34D399] text-[#042F2E] font-medium px-8 py-4 hover:bg-[#10B981] transition-colors active:scale-[0.98]"
          >
            Iniciar relato anônimo
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            data-testid="consultar-btn"
            onClick={() => navigate("/consultar")}
            className="inline-flex items-center justify-center rounded-full bg-white/10 text-white font-medium px-8 py-4 hover:bg-white/20 transition-colors border border-white/10"
          >
            Consultar meu protocolo
          </button>
        </motion.div>
      </section>

      {/* Manifesto chapters */}
      <section className="max-w-6xl mx-auto px-6 py-24 md:py-32">
        <div className="grid md:grid-cols-3 gap-6">
          {chapters.map((c, i) => {
            const Icon = c.icon;
            return (
              <motion.div
                key={c.n}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-2xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
              >
                <div className="flex items-center justify-between mb-8">
                  <span className="font-head text-5xl font-light text-white/15">{c.n}</span>
                  <Icon className="w-6 h-6 text-[#34D399]" />
                </div>
                <h3 className="font-head text-xl font-medium text-white mb-3">{c.title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm">{c.text}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      <footer className="max-w-6xl mx-auto px-6 pb-16 text-sm text-white/40">
        Este canal existe para acolher. Em situações de risco imediato, procure ajuda presencial.
      </footer>
    </Shell>
  );
}
