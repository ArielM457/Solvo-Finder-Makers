export default function SummaryCard({ summary }) {
  if (!summary) {
    return null
  }

  const objections = Array.isArray(summary.objections_raised)
    ? summary.objections_raised
    : []

  return (
    <div className="rounded-2xl border border-border border-l-4 border-l-primary bg-surface p-5">
      <h3 className="mb-5 text-lg font-semibold text-primary">AI Conversation Summary</h3>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-secondary">
            Outcome
          </p>
          <p className="text-sm leading-6 text-muted">{summary.outcome ?? 'No outcome yet'}</p>
        </div>

        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-secondary">
            Lead Tone
          </p>
          <p className="text-sm leading-6 text-muted">{summary.lead_tone ?? 'Unknown'}</p>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-secondary">
            Objections Raised
          </p>
          <div className="flex flex-wrap gap-2">
            {objections.length > 0 ? (
              objections.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-medium text-muted"
                >
                  {item}
                </span>
              ))
            ) : (
              <span className="text-sm text-zinc-500">No objections captured</span>
            )}
          </div>
        </div>

        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-secondary">
            Total Messages
          </p>
          <p className="text-sm leading-6 text-muted">{summary.total_messages ?? 0}</p>
        </div>

        <div className="md:col-span-2">
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-secondary">
            Recommendation
          </p>
          <p className="text-sm leading-6 text-muted">
            {summary.recommendation ?? 'No recommendation yet'}
          </p>
        </div>
      </div>
    </div>
  )
}
