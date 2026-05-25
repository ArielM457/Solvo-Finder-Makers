import { Link, useParams } from 'react-router-dom'
import FunnelStageBadge from '../components/FunnelStageBadge'
import ConversationThread from '../components/ConversationThread'
import SummaryCard from '../components/SummaryCard'
import { useConversation } from '../hooks/useConversation'
import { isApiConfigured } from '../lib/api'
import { formatChannel, formatMeetingDate, getLeadInitials } from '../utils/formatters'

export default function ConversationPage() {
  const { leadId } = useParams()
  const { lead, conversation, messages, meeting, isLoading, isError, error } = useConversation(leadId)

  if (leadId === 'inbox') {
    return (
      <div className="min-h-screen px-4 py-8 lg:px-8">
        <div className="panel mx-auto max-w-4xl p-8">
          <p className="mb-3 text-sm uppercase tracking-[0.24em] text-zinc-500">
            Conversation Workspace
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-muted">
            Pick a lead from the pipeline
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-zinc-500">
            Open any lead from the pipeline and this view will load the lead profile,
            conversation history, and AI summary in realtime.
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-bg"
          >
            Back to pipeline
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-5rem)] overflow-hidden px-4 py-6 lg:px-8">
      {!isApiConfigured && (
        <div className="mb-4 rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          Add `VITE_API_BASE_URL` to load conversation data from the backend.
        </div>
      )}

      {isError ? (
        <div className="panel p-6 text-sm text-rose-200">
          Could not load this conversation.
          {error?.message ? ` ${error.message}` : ''}
        </div>
      ) : (
        <div className="grid h-full gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
          <section className="panel flex h-full flex-col overflow-hidden">
            {isLoading ? (
              <div className="space-y-4 p-6">
                <div className="h-24 animate-pulse rounded-2xl bg-white/[0.03]" />
                <div className="h-48 animate-pulse rounded-2xl bg-white/[0.03]" />
              </div>
            ) : lead ? (
              <div className="flex h-full flex-col overflow-y-auto p-6">
                <div className="mb-6 flex flex-col items-center text-center">
                  <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl border border-border bg-zinc-900 text-xl font-semibold text-primary">
                    {getLeadInitials(lead.name)}
                  </div>
                  <h1 className="text-2xl font-semibold text-muted">{lead.name}</h1>
                  <p className="mt-1 text-sm text-zinc-500">
                    {lead.role} at {lead.company}
                  </p>
                </div>

                <div className="space-y-5">
                  <div>
                    <p className="mb-1 text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                      Email
                    </p>
                    <p className="text-sm text-muted">{lead.email}</p>
                  </div>

                  <div>
                    <p className="mb-2 text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                      Stage
                    </p>
                    <FunnelStageBadge stage={lead.stage} />
                  </div>

                  <div>
                    <p className="mb-1 text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                      Channel
                    </p>
                    <p className="text-sm text-muted">{formatChannel(lead.channel)}</p>
                  </div>

                  {(lead.stage === 'meeting_scheduled' || conversation?.status === 'meeting_scheduled') && (
                    <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
                      <p className="text-sm font-semibold text-emerald-400">Meeting Booked</p>
                      <p className="mt-1 text-sm text-emerald-100">
                        {formatMeetingDate(meeting?.scheduled_time)}
                      </p>
                    </div>
                  )}

                  <div className="rounded-2xl border border-border bg-surface/60 p-4">
                    <p className="mb-1 text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                      Conversation Status
                    </p>
                    <p className="text-sm capitalize text-muted">
                      {conversation?.status?.replace('_', ' ') ?? 'Not started'}
                    </p>
                  </div>
                </div>

                <div className="mt-auto pt-8">
                  <Link
                    to="/"
                    className="inline-flex rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-bg"
                  >
                    Back to pipeline
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center p-6 text-center text-sm text-zinc-500">
                Lead not found.
              </div>
            )}
          </section>

          <section className="panel flex h-full min-h-0 flex-col overflow-hidden">
            <div className="border-b border-border px-6 py-5">
              <p className="text-sm uppercase tracking-[0.24em] text-zinc-500">
                Conversation Thread
              </p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight text-muted">
                {lead?.company ?? 'Lead'} outreach
              </h2>
            </div>

            <div className="min-h-0 flex-1 overflow-hidden">
              {isLoading ? (
                <div className="space-y-4 p-6">
                  <div className="ml-auto h-20 w-3/4 animate-pulse rounded-2xl bg-white/[0.03]" />
                  <div className="h-24 w-3/4 animate-pulse rounded-2xl bg-white/[0.03]" />
                  <div className="ml-auto h-16 w-2/3 animate-pulse rounded-2xl bg-white/[0.03]" />
                </div>
              ) : (
                <ConversationThread messages={messages} />
              )}
            </div>

            {conversation?.status === 'closed' && (
              <div className="border-t border-border px-6 py-5">
                <SummaryCard summary={conversation.summary} />
              </div>
            )}

            <div className="border-t border-border bg-surface px-6 py-4">
              <div className="rounded-xl border border-border border-l-4 border-l-primary bg-dark px-4 py-3 text-sm text-muted">
                AI Agent is managing this conversation
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}
