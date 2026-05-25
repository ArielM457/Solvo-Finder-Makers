import Icon from '../components/Icon'
import { useMetrics } from '../hooks/useMetrics'
import { isApiConfigured } from '../lib/api'
import { formatMeetingDate, getLeadInitials } from '../utils/formatters'

const funnelStages = [
  { key: 'contacted', label: 'Contacted', color: 'bg-primary', widthScale: 1 },
  { key: 'replied', label: 'Replied', color: 'bg-secondary', widthScale: 0.8 },
  { key: 'meeting_scheduled', label: 'Scheduled', color: 'bg-dark', widthScale: 0.5 },
  { key: 'closed', label: 'Closed', color: 'bg-primary', widthScale: 0.2 },
]

function formatPercent(value) {
  return `${Number(value ?? 0).toFixed(1)}%`
}

function getStatusClasses(status) {
  switch (status) {
    case 'Upcoming':
      return 'border-primary/20 bg-primary/10 text-primary'
    case 'Completed':
      return 'border-secondary/30 bg-secondary/10 text-cyan-200'
    default:
      return 'border-amber-500/20 bg-amber-500/10 text-amber-200'
  }
}

function downloadMeetingsCsv(rows) {
  const headers = ['Lead Name', 'Company', 'Meeting Date', 'Status', 'AI Confidence']
  const body = rows.map((row) => [
    row.leadName,
    row.company,
    formatMeetingDate(row.meetingDate),
    row.status,
    row.confidence ?? '',
  ])

  const csv = [headers, ...body]
    .map((line) =>
      line
        .map((value) => `"${String(value ?? '').replaceAll('"', '""')}"`)
        .join(','),
    )
    .join('\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'zolvo-metrics-meetings.csv'
  link.click()
  URL.revokeObjectURL(url)
}

function KpiCard({ label, value, icon, changeText, changeTone = 'positive', progress = 0 }) {
  return (
    <div className="kpi-gradient group relative overflow-hidden rounded-2xl border border-border p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-dark">
      <div className="absolute right-4 top-4 opacity-10 transition-opacity group-hover:opacity-20">
        <Icon name={icon} className="text-6xl text-primary" />
      </div>
      <p className="mb-2 text-[11px] uppercase tracking-[0.28em] text-zinc-400">{label}</p>
      <div className="flex items-baseline gap-2">
        <h3 className="text-5xl font-bold tracking-tight text-primary">{value}</h3>
        <span
          className={`flex items-center gap-1 text-sm font-medium ${
            changeTone === 'negative' ? 'text-rose-300' : 'text-cyan-200'
          }`}
        >
          <Icon name={changeTone === 'negative' ? 'arrowDown' : 'arrowUp'} className="text-base" />
          {changeText}
        </span>
      </div>
      <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-black/30">
        <div className="h-full rounded-full bg-primary" style={{ width: `${progress}%` }} />
      </div>
    </div>
  )
}

function ConfidenceCell({ value }) {
  if (typeof value !== 'number') {
    return <span className="text-xs text-zinc-500">N/A</span>
  }

  return (
    <div className="flex items-center gap-2">
      <Icon name="bolt" className="text-base text-primary" />
      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-zinc-800">
        <div className="h-full rounded-full bg-primary" style={{ width: `${value}%` }} />
      </div>
      <span className="font-data-mono text-xs text-primary">{value}%</span>
    </div>
  )
}

export default function MetricsPage() {
  const { data, isLoading, isError, error } = useMetrics()
  const stageCounts = data?.stageCounts ?? {}
  const total = data?.total ?? 0
  const replied = stageCounts.replied ?? 0
  const scheduled = stageCounts.meeting_scheduled ?? 0
  const closed = stageCounts.closed ?? 0

  const funnelMetrics = {
    contactedPct: total > 0 ? 100 : 0,
    repliedPct: total > 0 ? (replied / total) * 100 : 0,
    scheduledPct: total > 0 ? (scheduled / total) * 100 : 0,
    closedPct: scheduled > 0 ? (closed / scheduled) * 100 : 0,
  }

  return (
    <div className="min-h-screen px-4 py-8 lg:px-8">
      {!isApiConfigured && (
        <div className="mb-6 rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          Add `VITE_API_BASE_URL` to load metrics from the backend.
        </div>
      )}

      <div className="mb-10 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-muted">Campaign Performance</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Real-time metrics for your AI-driven sales operations.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted transition-colors hover:border-primary"
          >
            <Icon name="calendar" className="text-base" />
            Last 30 Days
          </button>
          <button
            type="button"
            onClick={() => downloadMeetingsCsv(data?.recentMeetings ?? [])}
            className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted transition-colors hover:border-primary"
          >
            <Icon name="download" className="text-base" />
            Export CSV
          </button>
        </div>
      </div>

      {isError ? (
        <div className="panel p-6 text-sm text-rose-200">
          Could not load metrics.
          {error?.message ? ` ${error.message}` : ''}
        </div>
      ) : (
        <>
          <div className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-3">
            <KpiCard
              label="Total Leads"
              value={isLoading ? '--' : total.toLocaleString()}
              icon="groups"
              changeText="Live"
              progress={Math.min(total > 0 ? 70 : 0, 100)}
            />
            <KpiCard
              label="Reply Rate (%)"
              value={isLoading ? '--' : formatPercent(data?.replyRate ?? 0)}
              icon="replies"
              changeText={`${replied} replies`}
              progress={Math.min(data?.replyRate ?? 0, 100)}
            />
            <KpiCard
              label="Meetings Booked"
              value={isLoading ? '--' : String(data?.meetingsBooked ?? 0)}
              icon="meetings"
              changeText="Last 30 days"
              progress={Math.min((data?.meetingsBooked ?? 0) * 10, 100)}
            />
          </div>

          <section className="panel mb-10 p-6">
            <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <h2 className="flex items-center gap-2 text-xl font-semibold text-muted">
                <Icon name="funnel" className="text-primary" />
                Conversion Funnel
              </h2>
              <div className="flex items-center gap-4 text-sm text-zinc-500">
                <span className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-sm bg-primary" />
                  Current Period
                </span>
              </div>
            </div>

            <div className="mx-auto max-w-4xl space-y-4">
              {funnelStages.map((stage) => {
                const count = stageCounts[stage.key] ?? 0
                const visualWidth = `${stage.widthScale * 100}%`
                const labelPercent =
                  stage.key === 'contacted'
                    ? funnelMetrics.contactedPct
                    : stage.key === 'replied'
                      ? funnelMetrics.repliedPct
                      : stage.key === 'meeting_scheduled'
                        ? funnelMetrics.scheduledPct
                        : funnelMetrics.closedPct

                const descriptor =
                  stage.key === 'contacted'
                    ? 'Reach'
                    : stage.key === 'replied'
                      ? 'Response'
                      : stage.key === 'meeting_scheduled'
                        ? 'Interest'
                        : 'Win'

                return (
                  <div key={stage.key} className="flex items-center gap-4 md:gap-6">
                    <div className="w-24 shrink-0 text-right md:w-32">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                        {stage.label}
                      </p>
                      <p className="font-data-mono text-sm text-muted">
                        {isLoading ? '--' : count.toLocaleString()}
                      </p>
                    </div>

                    <div className="flex-1">
                      <div
                        className={`relative flex h-14 items-center justify-center overflow-hidden rounded-xl bg-white/5 ${stage.color === 'bg-primary' && stage.key === 'contacted' ? 'bg-primary/20' : stage.color === 'bg-secondary' ? 'bg-secondary/20' : stage.key === 'closed' ? 'bg-primary/30' : 'bg-dark/70'}`}
                        style={{ width: visualWidth, marginInline: 'auto' }}
                      >
                        <div className={`funnel-clip absolute inset-0 ${stage.color} opacity-90`} />
                        <span className="relative z-10 px-3 text-center text-sm font-semibold text-white">
                          {isLoading ? '--' : `${formatPercent(labelPercent)} ${descriptor}`}
                        </span>
                      </div>
                    </div>

                    <div className="w-16 shrink-0 text-right font-data-mono text-sm text-zinc-500 md:w-20">
                      {stage.key === 'contacted'
                        ? '--'
                        : isLoading
                          ? '--'
                          : `${Math.max(0, 100 - labelPercent).toFixed(1)}%`}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          <section className="panel overflow-hidden">
            <div className="flex items-center justify-between border-b border-border bg-white/[0.02] px-6 py-5">
              <h2 className="flex items-center gap-2 text-xl font-semibold text-muted">
                <Icon name="calendarMonth" className="text-primary" />
                Recent Meetings
              </h2>
              <button type="button" className="text-sm font-semibold text-primary hover:underline">
                View all history
              </button>
            </div>

            {isLoading ? (
              <div className="space-y-3 p-6">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="h-16 animate-pulse rounded-xl bg-white/[0.03]" />
                ))}
              </div>
            ) : data?.recentMeetings?.length ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[880px] border-collapse text-left">
                  <thead>
                    <tr className="bg-black/20">
                      <th className="border-b border-border px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                        Lead Name
                      </th>
                      <th className="border-b border-border px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                        Company
                      </th>
                      <th className="border-b border-border px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                        Date & Time
                      </th>
                      <th className="border-b border-border px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                        AI Confidence
                      </th>
                      <th className="border-b border-border px-6 py-4 text-right text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {data.recentMeetings.map((meeting) => (
                      <tr key={meeting.id} className="group transition-colors hover:bg-white/[0.03]">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
                              {getLeadInitials(meeting.leadName)}
                            </div>
                            <span className="text-sm font-semibold text-muted">
                              {meeting.leadName}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-zinc-400">{meeting.company}</td>
                        <td className="px-6 py-4 font-data-mono text-sm text-zinc-300">
                          {formatMeetingDate(meeting.meetingDate)}
                        </td>
                        <td className="px-6 py-4">
                          <ConfidenceCell value={meeting.confidence} />
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span
                            className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${getStatusClasses(meeting.status)}`}
                          >
                            {meeting.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-6 text-sm text-zinc-500">
                No meetings booked yet in the connected workspace.
              </div>
            )}
          </section>
        </>
      )}

      <div className="pointer-events-none fixed bottom-8 right-8 opacity-20">
        <div className="h-32 w-32 animate-pulse rounded-full bg-primary blur-[80px]" />
      </div>
    </div>
  )
}
