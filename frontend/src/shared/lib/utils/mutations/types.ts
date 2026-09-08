import { UseQueryOptions } from '@tanstack/react-query'
import { AxiosError } from 'axios'

export type TBaseEntity = {
  id: string
}
export type TBaseEntityId = {
  id: number
}
export type TMutationParameters<T> = {
  onSuccess?: (data?: T) => void
  onError?: (err: AxiosError) => void
}

export type TQueryParameters<T extends object> = Omit<
  UseQueryOptions<T>,
  'queryKey' | 'queryFn'
>
