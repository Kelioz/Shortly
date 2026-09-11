import { BarChartOutlined, SearchOutlined } from '@ant-design/icons'
import {
  App,
  Button,
  Card,
  Descriptions,
  Form,
  Input,
  Spin,
  Typography,
} from 'antd'
import { useEffect, useState } from 'react'
import { getApiErrorMessage } from '../../../shared/lib/api-error'
import styles from './StatsForm.module.scss'
import { URLModel } from '../../../entities'

type FormValues = { shortCode: string }

export function StatsForm() {
  const [shortCode, setShortCode] = useState<string>()
  const { message } = App.useApp()
  const model = URLModel.Hooks
  const data = model.useGetStats(shortCode || '')

  useEffect(() => {
    if (data.error) {
      message.error(getApiErrorMessage(data.error, 'Статистика не найдена'))
    }
  }, [message, data.error])

  const submit = async ({ shortCode: value }: FormValues) => {
    const nextShortCode = value.trim()

    if (nextShortCode === shortCode) {
      await data.refetch()
      return
    }

    setShortCode(nextShortCode)
  }

  return (
    <Card className={styles.root__card} variant='borderless'>
      <div className={styles.root__heading}>
        <span className={styles.root__icon}>
          <BarChartOutlined />
        </span>
        <div>
          <Typography.Title level={3}>Статистика</Typography.Title>
          <Typography.Text type='secondary'>
            Проверьте эффективность ссылки
          </Typography.Text>
        </div>
      </div>
      <Form<FormValues> layout='vertical' onFinish={submit}>
        <Form.Item
          label='Короткий код'
          name='shortCode'
          rules={[
            { required: true, message: 'Введите короткий код' },
            {
              pattern: /^[A-Za-z0-9]{6}$/,
              message: '6 латинских букв или цифр',
            },
          ]}
        >
          <Input
            size='large'
            prefix={<SearchOutlined />}
            placeholder='abc123'
          />
        </Form.Item>
        <Button
          type='default'
          htmlType='submit'
          size='large'
          loading={data.isFetching}
        >
          Получить статистику
        </Button>
      </Form>

      {data.data && !data.isFetching && (
        <Descriptions className={styles.root__stats} column={1} size='small'>
          <Descriptions.Item label='Оригинальный URL'>
            <a href={data.data.originalUrl} target='_blank' rel='noreferrer'>
              {data.data.originalUrl}
            </a>
          </Descriptions.Item>
          <Descriptions.Item label='Переходы'>
            {data.data.clicks}
          </Descriptions.Item>
          <Descriptions.Item label='Создана'>
            {new Date(data.data.createdAt).toLocaleString('ru-RU')}
          </Descriptions.Item>
        </Descriptions>
      )}
    </Card>
  )
}
