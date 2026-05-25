import { useQuery } from '@tanstack/react-query'
import { getLeads } from '../lib/api'

export function useLeads(stageFilter = 'all') {
  return useQuery({
    queryKey: ['leads', stageFilter],
    queryFn: () => getLeads(stageFilter),
    refetchInterval: 15_000,
  })
}
