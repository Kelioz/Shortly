import { App, notification } from 'antd'
import { URLModel } from '../../../entities'
import { AxiosError } from 'axios'
import { TMutationParameters } from '../../../shared/lib/utils/mutations'
import { ShortenResponse } from '../../../shared/api/Api.schemas'

export function useCreateShortenModel(
  props: TMutationParameters<ShortenResponse>
) {
  const { message } = App.useApp()
  const onSuccess = (data?: ShortenResponse) => {
    message.success('Готово')
    props.onSuccess && props.onSuccess(data)
  }
  const onError = (error: AxiosError) => {
    const message = error.message
    notification.error({
      message: message || 'Произошла непредвиденная ошибка',
    })

    props.onError && props.onError(error)
  }
  const createShortUrl = URLModel.Hooks.useCreateSorten({
    onSuccess,
    onError,
  })
  return {
    execute: createShortUrl.mutate,
    isPending: createShortUrl.isPending,
  }
}
