import { useMutation, useQueries } from '@tanstack/react-query'
import { apiClient } from '../../../shared/api'
import {
  ShortenRequest,
  ShortenResponse,
} from '../../../shared/api/Api.schemas'
import { TMutationParameters } from '../../../shared/lib/utils/mutations'
import { AxiosError } from 'axios'

export function useCreateSorten(props: TMutationParameters<ShortenResponse>) {
  return useMutation({
    mutationFn: (shortenRequest: ShortenRequest) =>
      apiClient.createShortUrl(shortenRequest),
    onSuccess(data) {
      props.onSuccess && props.onSuccess(data)
    },
    onError(error) {
      props.onError && props.onError(error as AxiosError)
    },
  })
}
