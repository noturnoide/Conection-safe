import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Copy, Check, ShieldCheck, Home } from "lucide-react";
import { toast } from "sonner";
import Shell from "../components/Shell";

export default function Protocol() {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const protocolo = sessionStorage.getItem("esc_protocolo");

  useEffect(() => {
    if (!protocolo) navigate("/");
  }, [protocolo, navigate]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(protocolo);
      setCopied(true);
      toast.success("Protocolo copiado.");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error("Não foi possível copiar.");
    }
  };

  if (!protocolo) return null;

  return (
    <Shell testid="protocol-page">
      <section className="max-w-2xl mx-auto px-6 py-16 md:py-24 text-center flex flex-col items-center">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 18 }}
          className="w-20 h-20 rounded-full bg-[#34D399]/15 border border-[#34D399]/30 flex items-center justify-center mb-8"
        >
          <ShieldCheck className="w-9 h-9 text-[#34D399]" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="font-head text-3xl md:text-4xl font-medium tracking-tight text-white mb-4"
        >
          Obrigado por confiar em nós.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="text-slate-300 max-w-md leading-relaxed mb-12"
        >
          Sua mensagem foi registrada de forma segura e anônima. Guarde o protocolo
          abaixo para acompanhar seu relato depois.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="w-full rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-2xl p-8 md:p-10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
        >
          <p className="text-xs tracking-[0.3em] uppercase font-semibold text-white/40 mb-5">
            Seu protocolo anônimo
          </p>
          <div
            data-testid="protocol-code"
            className="font-mono text-3xl sm:text-5xl tracking-[0.15em] text-[#34D399] mb-8 break-all"
            style={{ textShadow: "0 0 30px rgba(52,211,153,0.35)" }}
          >
            {protocolo}
          </div>
          <button
            data-testid="copy-protocol-btn"
            onClick={copy}
            className="inline-flex items-center gap-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white px-6 py-3 transition-colors"
          >
            {copied ? <Check className="w-5 h-5 text-[#34D399]" /> : <Copy className="w-5 h-5" />}
            {copied ? "Copiado" : "Copiar protocolo"}
          </button>
        </motion.div>

        <button
          data-testid="protocol-home-btn"
          onClick={() => navigate("/")}
          className="mt-10 inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors"
        >
          <Home className="w-4 h-4" /> Voltar ao início
        </button>
      </section>
    </Shell>
  );
}
