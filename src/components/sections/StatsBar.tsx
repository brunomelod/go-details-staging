export function StatsBar() {
  const stats = [
    { value: "160+", label: "5 Star Reviews" },
    { value: "4+", label: "Years serving Northern Colorado" },
    { value: "4K+", label: "Successful services completed" },
  ];

  return (
    <section className="border-y border-border bg-elevated py-10">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 md:grid-cols-3 md:px-6">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center md:text-left">
            <p className="text-4xl font-semibold text-accent">{stat.value}</p>
            <p className="mt-1 text-sm uppercase tracking-wide text-muted">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
