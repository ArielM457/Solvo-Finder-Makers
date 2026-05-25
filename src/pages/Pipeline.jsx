import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import FunnelStageBadge from '../components/FunnelStageBadge'
import Icon from '../components/Icon'
import { useLeads } from '../hooks/useLeads'
import { isApiConfigured } from '../lib/api'
import { formatChannel, formatRelativeTime, getLeadInitials } from '../utils/formatters'

const stageOptions = [
  { label: 'All stages', value: 'all' },
  { label: 'Contacted', value: 'contacted' },
  { label: 'Replied', value: 'replied' },
  { label: 'Meeting Scheduled', value: 'meeting_scheduled' },
  { label: 'Closed', value: 'closed' },
  { label: 'Discarded', value: 'discarded' },
]

export default function PipelinePage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [stageFilter, setStageFilter] = useState('all')
  const { data: leads = [], isLoading, isError, error } = useLeads(stageFilter)

  const filteredLeads = useMemo(() => {
    const term = search.trim().toLowerCase()

    if (!term) {
      return leads
    }

    return leads.filter((lead) => {
      const name = lead.name?.toLowerCase() ?? ''
      const company = lead.company?.toLowerCase() ?? ''
      return name.includes(term) || company.includes(term)
    })
  }, [leads, search])

  const metrics = useMemo(() => {
    const replied = leads.filter((lead) => lead.stage === 'replied').length
    const meetings = leads.filter((lead) => lead.stage === 'meeting_scheduled').length
    const closed = leads.filter((lead) => lead.stage === 'closed').length
    return { replied, meetings, closed }
  }, [leads])

  function handleOpenConversation(leadId) {
    localStorage.setItem('zolvo-last-lead-id', leadId)
    navigate(`/conversation/${leadId}`)
  }

  return (
    <div className="min-h-screen bg-bg">
      <header className="sticky top-0 z-30 border-b border-border bg-bg/90 px-4 py-4 backdrop-blur lg:px-8">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-primary">ZolvoReach</h1>
              <p className="text-sm text-zinc-500">Lead Pipeline</p>
            </div>
            <div className="hidden h-6 w-px bg-border/80 lg:mx-2 lg:block" />
            <div className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <span>Total leads</span>
              <span className="rounded-full bg-primary/15 px-2 py-0.5 text-xs text-muted">
                {filteredLeads.length}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <label className="relative block">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-zinc-500">
                <Icon name="search" />
              </span>
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by name or company"
                className="h-11 w-full rounded-xl border border-border bg-surface pl-11 pr-4 text-sm text-muted outline-none transition-colors placeholder:text-zinc-600 focus:border-primary md:w-72"
              />
            </label>

            <select
              value={stageFilter}
              onChange={(event) => setStageFilter(event.target.value)}
              className="h-11 rounded-xl border border-border bg-surface px-4 text-sm text-muted outline-none transition-colors focus:border-primary"
            >
              {stageOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      <section className="px-4 py-8 lg:px-8">
        {!isApiConfigured && (
          <div className="mb-6 rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
            Add `VITE_API_BASE_URL` to your frontend env file to load pipeline data
            from the backend.
          </div>
        )}

        <div className="mb-8 flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/10 px-3 py-1 text-xs font-medium tracking-[0.12em] text-primary">
              <Icon name="sparkles" className="text-base" />
              <span>AI Sales Command Center</span>
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-muted">
              Pipeline visibility for every outbound motion
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-zinc-500">
              Monitor prospect momentum, track stage movement, and jump into live
              conversations as soon as intent shifts.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/create-lead"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-bg transition-transform active:scale-[0.98]"
            >
              <Icon name="personAdd" />
              <span>Create lead</span>
            </Link>
            <div className="rounded-xl border border-border bg-surface px-4 py-3 text-sm text-zinc-500">
              New outreach lives in its own tab now, so Pipeline stays focused on
              visibility.
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="panel min-w-[180px] p-4">
              <p className="mb-2 text-[11px] uppercase tracking-[0.24em] text-zinc-500">
                Total Active Leads
              </p>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-semibold text-primary">{leads.length}</span>
                <span className="rounded-full bg-primary/10 px-2 py-1 text-[11px] font-semibold text-primary">
                  Live
                </span>
              </div>
            </div>
            <div className="panel min-w-[180px] p-4">
              <p className="mb-2 text-[11px] uppercase tracking-[0.24em] text-zinc-500">
                Replied
              </p>
              <div className="text-2xl font-semibold text-muted">{metrics.replied}</div>
            </div>
            <div className="panel min-w-[180px] p-4">
              <p className="mb-2 text-[11px] uppercase tracking-[0.24em] text-zinc-500">
                Meetings Scheduled
              </p>
              <div className="text-2xl font-semibold text-secondary">{metrics.meetings}</div>
            </div>
          </div>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <div className="panel p-5">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-[11px] uppercase tracking-[0.24em] text-zinc-500">
                New Leads
              </p>
              <Icon name="personAdd" className="text-primary" />
            </div>
            <p className="text-4xl font-semibold tracking-tight text-primary">Create</p>
            <p className="mt-2 text-sm text-zinc-500">
              Use the dedicated Create Lead tab to trigger the n8n intake workflow.
            </p>
          </div>

          <div className="panel p-5">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-[11px] uppercase tracking-[0.24em] text-zinc-500">
                Response Velocity
              </p>
              <Icon name="speed" className="text-primary" />
            </div>
            <p className="text-4xl font-semibold tracking-tight text-primary">
              {leads.length > 0 ? 'Live' : '--'}
            </p>
            <p className="mt-2 text-sm text-zinc-500">
              Lead activity will appear here after replies begin to arrive.
            </p>
          </div>

          <div className="panel p-5">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-[11px] uppercase tracking-[0.24em] text-zinc-500">
                Top Performing Channel
              </p>
              <Icon name="hub" className="text-secondary" />
            </div>
            <p className="text-4xl font-semibold tracking-tight text-secondary">
              {leads.filter((lead) => lead.channel === 'linkedin').length >=
              leads.filter((lead) => lead.channel === 'email').length
                ? 'LinkedIn'
                : 'Email'}
            </p>
            <p className="mt-2 text-sm text-zinc-500">
              Quick view based on the current visible leads in your pipeline.
            </p>
          </div>
        </div>

        <div className="panel overflow-hidden">
          <div className="flex items-center justify-between border-b border-border bg-white/[0.02] px-6 py-4">
            <div>
              <p className="text-lg font-semibold text-muted">Lead pipeline</p>
              <p className="text-sm text-zinc-500">
                Search, filter, and open a live prospect thread.
              </p>
            </div>
            <div className="hidden items-center gap-2 text-xs text-zinc-500 md:flex">
              <button type="button" className="rounded-lg border border-border p-2">
                <Icon name="chevronLeft" />
              </button>
              <button type="button" className="rounded-lg border border-border p-2">
                <Icon name="chevronRight" />
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-3 p-6">
              {[...Array(5)].map((_, index) => (
                <div
                  key={index}
                  className="h-16 animate-pulse rounded-xl border border-border bg-white/[0.02]"
                />
              ))}
            </div>
          ) : isError ? (
            <div className="p-6">
              <div className="rounded-2xl border border-rose-900/50 bg-rose-950/30 p-5 text-sm text-rose-200">
                Could not load leads from the backend.
                {error?.message ? ` ${error.message}` : ''}
              </div>
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="flex min-h-[320px] flex-col items-center justify-center px-6 py-12 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Icon name="pipeline" className="text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-muted">No leads yet. Connect your pipeline.</h3>
              <p className="mt-2 max-w-md text-sm text-zinc-500">
                Open the Create Lead tab to send the first prospects into your n8n and
                backend flow.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead className="bg-white/[0.02] text-[11px] uppercase tracking-[0.22em] text-zinc-500">
                  <tr>
                    <th className="px-6 py-4 font-medium">Name</th>
                    <th className="px-6 py-4 font-medium">Company</th>
                    <th className="px-6 py-4 font-medium">Role</th>
                    <th className="px-6 py-4 font-medium">Channel</th>
                    <th className="px-6 py-4 font-medium">Stage</th>
                    <th className="px-6 py-4 font-medium">Last Activity</th>
                    <th className="px-6 py-4 text-right font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredLeads.map((lead) => (
                    <tr
                      key={lead.id}
                      onClick={() => handleOpenConversation(lead.id)}
                      className="group cursor-pointer transition-all duration-200 hover:bg-primary/[0.04]"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-zinc-900 text-xs font-semibold text-primary">
                            {getLeadInitials(lead.name)}
                          </div>
                          <div>
                            <p className="font-medium text-muted">{lead.name}</p>
                            <p className="text-xs text-zinc-500">{lead.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm text-muted">{lead.company}</td>
                      <td className="px-6 py-5 text-sm text-zinc-400">{lead.role}</td>
                      <td className="px-6 py-5">
                        <span className="inline-flex rounded-full border border-border bg-zinc-900 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
                          {formatChannel(lead.channel)}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <FunnelStageBadge stage={lead.stage} />
                      </td>
                      <td className="px-6 py-5 text-sm text-zinc-400">
                        <span className="font-data-mono">{formatRelativeTime(lead.last_activity)}</span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation()
                            handleOpenConversation(lead.id)
                          }}
                          className="font-medium text-primary transition-colors hover:text-cyan-300"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-1">
          <div className="panel relative overflow-hidden p-5">
            <div className="relative z-10">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-[11px] uppercase tracking-[0.24em] text-zinc-500">
                  AI Forecast
                </p>
                <Icon name="trend" className="text-primary" />
              </div>
              <p className="text-4xl font-semibold tracking-tight text-muted">
                {metrics.meetings + metrics.closed}
              </p>
              <p className="mt-2 text-sm text-zinc-500">
                Prospects already close to a meeting or closed-won milestone.
              </p>
            </div>
            <Icon
              name="forecast"
              className="absolute -bottom-6 -right-3 text-[120px] text-primary/10"
            />
          </div>
        </div>
      </section>
    </div>
  )
}
