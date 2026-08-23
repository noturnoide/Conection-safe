import { MapPin, Clock, User, FileText } from "lucide-react";

const formatDate = (iso) => {
  try {
    return new Date(iso).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
};

export default function ReportDetail({ report }) {
  return (
    <div
      data-testid={`report-detail-${report.protocolo}`}
      className="bg-white p-4"
      style={{
        border: "1px solid rgba(11,30,63,0.08)",
        borderRadius: "1.75rem",
        boxShadow: "0 10px 40px rgba(11,30,63,0.06)",
        padding: "2rem",
      }}
    >
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-4">
        <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: "1.125rem", letterSpacing: "0.15em", color: "#1E3A8A" }}>
          {report.protocolo}
        </span>
        <span className="small" style={{ color: "#94A3B8" }}>{formatDate(report.created_at)}</span>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-sm-6"><Info icon={FileText} label="Tipo de situação" value={report.tipo} /></div>
        <div className="col-sm-6"><Info icon={MapPin} label="Localidade" value={report.localidade} /></div>
        <div className="col-sm-6"><Info icon={User} label="Vivência" value={report.vivencia} /></div>
        <div className="col-sm-6"><Info icon={Clock} label="Quando ocorreu" value={report.tempo} /></div>
      </div>

      <div className="mb-4">
        <p className="small text-uppercase fw-semibold mb-2" style={{ letterSpacing: "0.2em", color: "#6B7A99" }}>
          Detalhes
        </p>
        <p className="mb-0 lh-base" style={{ color: "#0B1E3F", whiteSpace: "pre-wrap" }}>{report.detalhes}</p>
      </div>

      {report.denunciados?.length > 0 && (
        <div>
          <p className="small text-uppercase fw-semibold mb-3" style={{ letterSpacing: "0.2em", color: "#6B7A99" }}>
            Pessoas envolvidas
          </p>
          <div className="d-flex flex-wrap gap-2">
            {report.denunciados.map((d, i) => {
              const parts = [];
              if (d.nome) parts.push(d.nome);
              if (d.cargo) parts.push(d.cargo);
              if (d.cargo === "Aluno" && d.turma) parts.push(d.turma);
              return (
                <span
                  key={i}
                  className="rounded-pill px-3 py-2 small"
                  style={{
                    backgroundColor: "rgba(30,58,138,0.08)",
                    border: "1px solid rgba(30,58,138,0.20)",
                    color: "#1E3A8A",
                  }}
                >
                  {parts.join(" · ")}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

const Info = ({ icon: Icon, label, value }) => (
  <div
    className="p-3"
    style={{
      backgroundColor: "#F7F9FD",
      border: "1px solid rgba(11,30,63,0.06)",
      borderRadius: "1rem",
    }}
  >
    <div className="d-flex align-items-center gap-1 small text-uppercase mb-1" style={{ color: "#6B7A99", letterSpacing: "0.08em" }}>
      <Icon className="w-3 h-3" /> {label}
    </div>
    <p className="mb-0" style={{ color: "#0B1E3F" }}>{value}</p>
  </div>
);
