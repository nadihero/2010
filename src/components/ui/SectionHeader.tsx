type SectionHeaderProps = {
  number: string;
  title: string;
  inverted?: boolean;
};

export function SectionHeader({ number, title, inverted = false }: SectionHeaderProps) {
  return (
    <div className="mb-10">
      <p className={`font-mono text-xs mb-1 ${inverted ? "text-newsprint/60" : "text-ink-faded"}`}>
        {number}
      </p>
      <h3
        className={`font-serif text-3xl md:text-4xl font-black uppercase pb-3 inline-block ${
          inverted
            ? "border-b-4 border-double border-newsprint"
            : "double-border-bottom"
        }`}
      >
        {title}
      </h3>
    </div>
  );
}