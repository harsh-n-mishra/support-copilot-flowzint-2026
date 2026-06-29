type PlaceholderProps = {
  title: string;
};

export function Placeholder({ title }: PlaceholderProps) {
  return (
    <section className="stack-lg" aria-labelledby="placeholder-title">
      <div className="glass-panel p-8">
        <p className="text-label text-accent">Milestone preview</p>
        <h1 id="placeholder-title" className="text-display mt-3">
          {title}
        </h1>
        <p className="text-body mt-4 max-w-2xl text-muted">
          This page will be implemented in a later milestone.
        </p>
      </div>
    </section>
  );
}
