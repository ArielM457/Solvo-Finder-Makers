const stageMap = {
  contacted: 'border-zinc-700 bg-zinc-800 text-zinc-300',
  replied: 'border-primary/30 bg-primary/15 text-primary',
  meeting_scheduled: 'border-secondary/40 bg-secondary/20 text-cyan-200',
  closed: 'border-emerald-500/30 bg-emerald-500/15 text-emerald-400',
  discarded: 'border-rose-900/60 bg-rose-950/60 text-rose-300',
}

function formatStage(stage) {
  return stage
    .split('_')
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(' ')
}

export default function FunnelStageBadge({ stage }) {
  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${
        stageMap[stage] ?? 'border-zinc-700 bg-zinc-800 text-zinc-300'
      }`}
    >
      {formatStage(stage)}
    </span>
  )
}
