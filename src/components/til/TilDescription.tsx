type TilDescriptionProps = {
  title: string;
  description: string;
  codeSnippet: string | null;
};

function CodeSpan({ children }: { children: string }) {
  return (
    <code className="font-mono text-xs bg-newsprint-accent px-1 border border-black">
      {children}
    </code>
  );
}

export function TilDescription({ title, description, codeSnippet }: TilDescriptionProps) {
  if (!codeSnippet) {
    return (
      <>
        <span className="font-bold">{title}</span> — {description}
      </>
    );
  }

  const snippets = codeSnippet
    .split("|")
    .map((s) => s.trim())
    .filter(Boolean);

  if (snippets.length === 1) {
    const snippet = snippets[0];
    if (description.includes(snippet)) {
      const parts = description.split(snippet);
      return (
        <>
          <span className="font-bold">{title}</span> — {parts[0]}
          <CodeSpan>{snippet}</CodeSpan>
          {parts.slice(1).join(snippet)}
        </>
      );
    }
    return (
      <>
        <span className="font-bold">{title}</span> — {description} Using <CodeSpan>{snippet}</CodeSpan>.
      </>
    );
  }

  const forIndex = description.toLowerCase().indexOf(" for ");
  const tail = forIndex !== -1 ? description.slice(forIndex + 5) : description;

  return (
    <>
      <span className="font-bold">{title}</span> — Understanding{" "}
      {snippets.map((snippet, i) => (
        <span key={snippet}>
          {i > 0 && " vs "}
          <CodeSpan>{snippet}</CodeSpan>
        </span>
      ))}{" "}
      for {tail}
    </>
  );
}