interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  accent?: string;
}

export default function SectionHeader({ title, subtitle, accent }: SectionHeaderProps) {
  return (
    <div className="mb-5">
      {accent && (
        <span
          className="inline-block text-xs font-bold uppercase tracking-widest mb-1 px-2 py-0.5 rounded-full"
          style={{ background: "#f5e6d3", color: "#c9853a" }}
        >
          {accent}
        </span>
      )}
      <h2
        className="text-xl font-bold leading-tight"
        style={{ color: "#1e3a5f", fontFamily: '"Playfair Display", Georgia, serif' }}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="text-sm mt-1" style={{ color: "#7a6a56" }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
