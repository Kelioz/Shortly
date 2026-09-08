import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../../../shared/api'

export function useGetStats(shortCode: string) {
  return useQuery({
    queryKey: ['stats', shortCode],
    queryFn: () => apiClient.getShortUrlStats(shortCode),
    enabled: !!shortCode,
  })
}
