import { useQuery } from '@tanstack/react-query'
import { getConversation, getLead } from '../lib/api'
import { safeParseSummary } from '../utils/formatters'

async function fetchConversation(leadId) {
  if (!leadId || leadId === 'inbox') {
    return {
      lead: null,
      conversation: null,
      messages: [],
      meeting: null,
    }
  }

  const [lead, conversationPayload] = await Promise.all([
    getLead(leadId),
    getConversation(leadId),
  ])

  const conversation = conversationPayload?.conversation
    ? {
        ...conversationPayload.conversation,
        summary: safeParseSummary(conversationPayload.conversation.summary),
      }
    : null

  const messages = conversationPayload?.messages ?? []

  return {
    lead,
    conversation,
    messages,
    meeting: conversationPayload?.meeting ?? null,
  }
}

export function useConversation(leadId) {
  const query = useQuery({
    queryKey: ['conversation', leadId],
    queryFn: () => fetchConversation(leadId),
    enabled: Boolean(leadId),
    refetchInterval: leadId && leadId !== 'inbox' ? 10_000 : false,
  })

  return {
    lead: query.data?.lead ?? null,
    conversation: query.data?.conversation ?? null,
    messages: query.data?.messages ?? [],
    meeting: query.data?.meeting ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  }
}
