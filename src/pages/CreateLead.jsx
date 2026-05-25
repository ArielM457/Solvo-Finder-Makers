import { useMemo, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import Icon from '../components/Icon'
import FunnelStageBadge from '../components/FunnelStageBadge'
import { useLeads } from '../hooks/useLeads'
import { createLead, isApiConfigured } from '../lib/api'
import { formatChannel, formatRelativeTime } from '../utils/formatters'

const initialLeadForm = {
  name: '',
  company: '',
  role: '',
  email: '',
  channel: 'email',
  linkedin_profile: '',
  outreach_context: '',
}

export default function CreateLeadPage() {
  const queryClient = useQueryClient()
  const [leadForm, setLeadForm] = useState(initialLeadForm)
  const [submissionLog, setSubmissionLog] = useState([])
  const { data: leads = [] } = useLeads('all')

  const createLeadMutation = useMutation({
    mutationFn: createLead,
    onSuccess: (data) => {
      const entry = {
        id: `${Date.now()}-${leadForm.email}`,
        name: leadForm.name,
        company: leadForm.company,
        email: leadForm.email,
        status: data?.stage ?? 'created',
        timestamp: new Date().toISOString(),
      }

      setSubmissionLog((current) => [entry, ...current].slice(0, 6))
      setLeadForm(initialLeadForm)
      queryClient.invalidateQueries({ queryKey: ['leads'] })
    },
  })

  const recentLeads = useMemo(() => {
    return [...leads]
      .sort((left, right) => new Date(right.created_at) - new Date(left.created_at))
      .slice(0, 6)
  }, [leads])

  function handleChange(event) {
    const { name, value } = event.target
    setLeadForm((current) => ({ ...current, [name]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    const payload = {
      name: leadForm.name,
      company: leadForm.company,
      role: leadForm.role,
      email: leadForm.email,
      channel: leadForm.channel,
    }
    createLeadMutation.mutate(payload)
  }

  return (
    <div className="min-h-screen bg-bg">
      <header className="sticky top-0 z-30 border-b border-border bg-bg/90 px-4 py-4 backdrop-blur lg:px-8">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-primary">Create Lead</h1>
            <p className="text-sm text-zinc-500">
              Trigger the new-lead automation and send the default first contact email.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              {recentLeads.length} recent leads loaded
            </div>
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2 text-sm font-medium text-muted transition-colors hover:border-primary hover:text-primary"
            >
              <Icon name="pipeline" />
              <span>Back to pipeline</span>
            </Link>
          </div>
        </div>
      </header>

      <section className="px-4 py-8 lg:px-8">
        {!isApiConfigured && (
          <div className="mb-6 rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
            Add `VITE_API_BASE_URL` to the frontend env so this form can create leads.
          </div>
        )}

        <div className="mb-8 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <section className="panel p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/12 text-primary">
                <Icon name="personAdd" className="text-2xl" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-muted">New lead intake</h2>
                <p className="text-sm text-zinc-500">
                  This sends the lead directly to the backend and stores it in the pipeline.
                </p>
              </div>
            </div>

            <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                  Lead name
                </span>
                <input
                  required
                  name="name"
                  value={leadForm.name}
                  onChange={handleChange}
                  className="h-11 w-full rounded-xl border border-border bg-surface px-4 text-sm text-muted outline-none focus:border-primary"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                  Company
                </span>
                <input
                  required
                  name="company"
                  value={leadForm.company}
                  onChange={handleChange}
                  className="h-11 w-full rounded-xl border border-border bg-surface px-4 text-sm text-muted outline-none focus:border-primary"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                  Role
                </span>
                <input
                  required
                  name="role"
                  value={leadForm.role}
                  onChange={handleChange}
                  className="h-11 w-full rounded-xl border border-border bg-surface px-4 text-sm text-muted outline-none focus:border-primary"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                  Email
                </span>
                <input
                  required
                  type="email"
                  name="email"
                  value={leadForm.email}
                  onChange={handleChange}
                  className="h-11 w-full rounded-xl border border-border bg-surface px-4 text-sm text-muted outline-none focus:border-primary"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                  Channel
                </span>
                <select
                  name="channel"
                  value={leadForm.channel}
                  onChange={handleChange}
                  className="h-11 w-full rounded-xl border border-border bg-surface px-4 text-sm text-muted outline-none focus:border-primary"
                >
                  <option value="email">Email</option>
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                  LinkedIn profile
                </span>
                <input
                  name="linkedin_profile"
                  value={leadForm.linkedin_profile}
                  onChange={handleChange}
                  placeholder="Optional for later LinkedIn flows"
                  className="h-11 w-full rounded-xl border border-border bg-surface px-4 text-sm text-muted outline-none focus:border-primary"
                />
              </label>

              <label className="block md:col-span-2">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                  Outreach context
                </span>
                <textarea
                  name="outreach_context"
                  value={leadForm.outreach_context}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Optional context for future custom first-touch workflows."
                  className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-muted outline-none focus:border-primary"
                />
              </label>

              <div className="md:col-span-2 flex flex-col gap-3 rounded-2xl border border-border bg-white/[0.02] p-4 text-sm text-zinc-400">
                <div className="flex items-start gap-3">
                  <Icon name="mail" className="mt-0.5 text-primary" />
                  <p>
                    This route creates the lead in the backend before any outreach starts.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Icon name="checklist" className="mt-0.5 text-secondary" />
                  <p>
                    If the backend accepts the request, the lead should appear in Pipeline.
                  </p>
                </div>
              </div>

              <div className="md:col-span-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-zinc-500">
                  Use this screen whenever you want to add another prospect and trigger
                  the default first email.
                </p>
                <button
                  type="submit"
                  disabled={createLeadMutation.isPending || !isApiConfigured}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-bg transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Icon name="send" />
                  {createLeadMutation.isPending ? 'Sending to backend...' : 'Create lead'}
                </button>
              </div>
            </form>

            {createLeadMutation.isError && (
              <div className="mt-4 rounded-2xl border border-rose-900/50 bg-rose-950/30 px-4 py-3 text-sm text-rose-200">
                {createLeadMutation.error?.message ?? 'Could not create the lead.'}
              </div>
            )}
          </section>

          <aside className="space-y-6">
            <section className="panel p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/15 text-secondary">
                  <Icon name="sparkles" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-muted">Automation target</h3>
                  <p className="text-sm text-zinc-500">
                    Current backend URL configured in the frontend env.
                  </p>
                </div>
              </div>
              <div className="rounded-2xl border border-border bg-surface p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                  backend base url
                </p>
                <p className="break-all font-data-mono text-xs text-primary">
                  {import.meta.env.VITE_API_BASE_URL ?? 'Not configured'}
                </p>
              </div>
            </section>

            <section className="panel p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/12 text-primary">
                  <Icon name="checklist" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-muted">Latest submissions</h3>
                  <p className="text-sm text-zinc-500">
                    Quick confirmation that the automation accepted the lead.
                  </p>
                </div>
              </div>

              {submissionLog.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border bg-surface/50 p-5 text-sm text-zinc-500">
                  Your accepted lead submissions will show here after the first send.
                </div>
              ) : (
                <div className="space-y-3">
                  {submissionLog.map((entry) => (
                    <div key={entry.id} className="rounded-2xl border border-border bg-surface p-4">
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <p className="font-medium text-muted">{entry.name}</p>
                        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
                          {entry.status}
                        </span>
                      </div>
                      <p className="text-sm text-zinc-400">{entry.company}</p>
                      <p className="mt-1 text-xs text-zinc-500">{entry.email}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </aside>
        </div>

        <section className="panel p-6">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-muted">Recently created leads</h2>
              <p className="text-sm text-zinc-500">
                A quick view so you can confirm multiple leads are entering the pipeline.
              </p>
            </div>
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary"
            >
              <Icon name="pipeline" />
              <span>Open pipeline</span>
            </Link>
          </div>

          {recentLeads.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-surface/50 p-6 text-sm text-zinc-500">
              When the first lead is created, it will appear here and in Pipeline.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {recentLeads.map((lead) => (
                <div key={lead.id} className="rounded-2xl border border-border bg-surface p-5">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-muted">{lead.name}</p>
                      <p className="text-sm text-zinc-500">{lead.company}</p>
                    </div>
                    <FunnelStageBadge stage={lead.stage} />
                  </div>
                  <p className="text-sm text-zinc-400">{lead.role}</p>
                  <div className="mt-4 flex items-center justify-between text-xs text-zinc-500">
                    <span className="rounded-full border border-border bg-bg px-3 py-1 font-semibold uppercase tracking-[0.16em] text-primary">
                      {formatChannel(lead.channel)}
                    </span>
                    <span className="font-data-mono">{formatRelativeTime(lead.last_activity)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </section>
    </div>
  )
}
