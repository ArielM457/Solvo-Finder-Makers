import { useQuery } from '@tanstack/react-query'
import { getMetrics } from '../lib/api'

function normalizeMetrics(data) {
  return {
    total: data?.total ?? 0,
    replyRate: data?.reply_rate ?? 0,
    meetingsBooked: data?.meetings_booked ?? 0,
    stageCounts: data?.stage_counts ?? {},
    recentMeetings: (data?.recent_meetings ?? []).map((meeting) => ({
      id: meeting.id,
      leadId: meeting.lead_id,
      leadName: meeting.lead_name,
      company: meeting.company,
      meetingDate: meeting.meeting_date,
      status: meeting.status,
      confidence: meeting.confidence,
    })),
  }
}

export function useMetrics() {
  return useQuery({
    queryKey: ['metrics'],
    queryFn: async () => normalizeMetrics(await getMetrics()),
    refetchInterval: 20_000,
  })
}
