import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

// Rounded select, light theme (white + dark navy).
export default function StyledSelect({
  value,
  onValueChange,
  placeholder = "Selecione...",
  options = [],
  testid,
}) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger
        data-testid={testid}
        className="w-full h-auto rounded-[2rem] border bg-white px-6 py-4 text-base transition-colors duration-300 shadow-sm focus:outline-none focus:ring-4"
        style={{
          borderColor: "var(--esc-line)",
          color: "var(--esc-ink)",
        }}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent
        className="rounded-2xl border bg-white"
        style={{ borderColor: "var(--esc-line)", color: "var(--esc-ink)" }}
      >
        {options.map((opt) => (
          <SelectItem
            key={opt}
            value={opt}
            data-testid={testid ? `${testid}-option-${opt.replace(/\s+/g, "-").toLowerCase()}` : undefined}
            className="rounded-xl px-4 py-2.5 focus:bg-[#1E3A8A]/10 data-[state=checked]:text-[#1E3A8A]"
            style={{ color: "var(--esc-ink)" }}
          >
            {opt}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
