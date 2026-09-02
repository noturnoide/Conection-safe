import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Icon from "../components/Icon";
import Shell from "../components/Shell";
import logoConexaoSegura from "../assets/logo_conexaosegura.png";

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
    icon: "eye-off",
  },
  {
    n: "02",
    title: "Um espaço protegido",
    text: "Este é um canal de escuta. Aqui você pode relatar assédio moral, assédio sexual ou cyberbullying com total tranquilidade.",
    icon: "lock",
  },
  {
    n: "03",
    title: "Estamos ouvindo",
    text: "Cada relato é lido com cuidado e respeito. Você recebe um protocolo anônimo para acompanhar, sem se expor.",
    icon: "hand-heart",
  },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <Shell testid="landing-page">
      <section className="container px-6 pt-16 pb-24 md:pt-24 min-h-[78vh] d-flex flex-column justify-content-center" style={{ maxWidth: "72rem" }}>
        <motion.img
         src={logoConexaoSegura}
         alt="Logo Conexão Segura"
         initial={{ opacity: 0, y: 12 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.6 }}
         className="mb-4"
         style={{
           width: "110px",
           height: "auto",
           objectFit: "contain"
         }}
       />
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="mb-4 small text-uppercase fw-semibold"
          style={{ letterSpacing: "0.3em", color: "#1E3A8A" }}
        >
          Conexão Segura: Canal de Escuta Anônimo
        </motion.p>

        <h1
          className="fw-light lh-1 mb-0"
          style={{ fontSize: "clamp(2.75rem, 6vw, 5rem)", color: "var(--esc-ink)", letterSpacing: "-0.03em" }}
        >
          {heroLines.map((line, i) => (
            <span key={i} className="d-block overflow-hidden py-1">
              <motion.span
                className="d-block"
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
          className="fs-5 lh-base"
          style={{ maxWidth: "36rem", color: "#334166", marginTop: "2rem" }}
        >
          Responda ao questionário abaixo com total sigilo. Este é um espaço seguro
          para relatar situações difíceis — sem nome, sem julgamento, sem exposição.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.7 }}
          className="d-flex flex-column flex-sm-row"
          style={{ marginTop: "3rem", gap: "1rem" }}
        >
          <button
            data-testid="start-report-btn"
            onClick={() => navigate("/relatar")}
            className="btn rounded-pill px-4 py-3 fw-medium d-inline-flex align-items-center justify-content-center gap-2"
            style={{ backgroundColor: "#0B1E3F", color: "#fff", border: "none" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#142A55")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#0B1E3F")}
          >
            Iniciar relato anônimo
            <Icon name="arrow-right" size={5} />
          </button>
          <button
            data-testid="consultar-btn"
            onClick={() => navigate("/consultar")}
            className="btn rounded-pill px-4 py-3 fw-medium"
            style={{ backgroundColor: "#fff", color: "#0B1E3F", border: "1px solid rgba(11,30,63,0.15)" }}
          >
            Consultar meu protocolo
          </button>
        </motion.div>
      </section>

      <section className="container px-6 py-5 pb-5" style={{ maxWidth: "72rem", paddingTop: "6rem", paddingBottom: "8rem" }}>
        <div className="row g-4">
          {chapters.map((c, i) => {
            return (
              <div key={c.n} className="col-md-4">
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.7, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                  className="rounded-4 bg-white p-4 h-100"
                  style={{
                    border: "1px solid rgba(11,30,63,0.08)",
                    boxShadow: "0 10px 40px rgba(11,30,63,0.06)",
                    borderRadius: "2rem",
                    padding: "2rem",
                  }}
                >
                  <div className="d-flex align-items-center justify-content-between mb-4">
                    <span className="fw-light" style={{ fontSize: "3rem", color: "rgba(11,30,63,0.12)" }}>{c.n}</span>
                    <Icon name={c.icon} size={6} style={{ color: "#1E3A8A" }} />
                  </div>
                  <h3 className="fs-5 fw-medium mb-2" style={{ color: "var(--esc-ink)" }}>{c.title}</h3>
                  <p className="small mb-0 lh-base" style={{ color: "#6B7A99" }}>{c.text}</p>
                </motion.div>
              </div>
            );
          })}
        </div>
      </section>

      <footer className="container px-6 pb-5 small" style={{ maxWidth: "72rem", color: "#6B7A99" }}>
        Este canal existe para acolher. Em situações de risco imediato, procure ajuda presencial.
      </footer>
    </Shell>
  );
}
