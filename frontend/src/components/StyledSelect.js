import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

// Highly rounded, glassmorphic select honoring the design spec.
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
        className="w-full h-auto rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-md px-6 py-4 text-base text-white data-[placeholder]:text-white/40 focus:border-[#34D399]/50 focus:bg-white/10 focus:ring-4 focus:ring-[#34D399]/10 transition-colors duration-300"
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="rounded-2xl border border-white/10 bg-[#0E1B2A] text-white">
        {options.map((opt) => (
          <SelectItem
            key={opt}
            value={opt}
            data-testid={testid ? `${testid}-option-${opt.replace(/\s+/g, "-").toLowerCase()}` : undefined}
            className="rounded-xl px-4 py-2.5 text-white focus:bg-[#34D399]/15 focus:text-white data-[state=checked]:text-[#34D399]"
          >
            {opt}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
