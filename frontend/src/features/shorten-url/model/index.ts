import { App, notification } from 'antd'
import { URLModel } from '../../../entities'
import { AxiosError } from 'axios'
import { getApiErrorMessage } from '../../../shared/lib/api-error'
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
    notification.error({
      message: getApiErrorMessage(error, 'Не удалось создать короткую ссылку'),
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
