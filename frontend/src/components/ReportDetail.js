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

// Reusable detailed view of a single anonymous report.
export default function ReportDetail({ report }) {
  return (
    <div
      data-testid={`report-detail-${report.protocolo}`}
      className="rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-2xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <span className="font-mono text-lg tracking-[0.15em] text-[#34D399]">
          {report.protocolo}
        </span>
        <span className="text-xs text-white/40">{formatDate(report.created_at)}</span>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <Info icon={FileText} label="Tipo de situação" value={report.tipo} />
        <Info icon={MapPin} label="Localidade" value={report.localidade} />
        <Info icon={User} label="Vivência" value={report.vivencia} />
        <Info icon={Clock} label="Quando ocorreu" value={report.tempo} />
      </div>

      <div className="mb-6">
        <p className="text-xs tracking-[0.2em] uppercase font-semibold text-white/40 mb-2">
          Detalhes
        </p>
        <p className="text-slate-200 leading-relaxed whitespace-pre-wrap">{report.detalhes}</p>
      </div>

      {report.denunciados?.length > 0 && (
        <div>
          <p className="text-xs tracking-[0.2em] uppercase font-semibold text-white/40 mb-3">
            Pessoas envolvidas
          </p>
          <div className="flex flex-wrap gap-2">
            {report.denunciados.map((d, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-2 rounded-full bg-[#34D399]/10 border border-[#34D399]/20 text-[#a7f3d0] text-sm px-4 py-2"
              >
                {d.cargo}
                {d.cargo === "Aluno" && d.turma ? ` · ${d.turma}` : ""}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const Info = ({ icon: Icon, label, value }) => (
  <div className="rounded-2xl bg-white/[0.03] border border-white/5 p-4">
    <div className="flex items-center gap-2 text-white/40 text-xs uppercase tracking-wider mb-1">
      <Icon className="w-3.5 h-3.5" /> {label}
    </div>
    <p className="text-white">{value}</p>
  </div>
);
