import { BarChartOutlined, SearchOutlined } from '@ant-design/icons'
import { App, Button, Card, Descriptions, Form, Input, Typography } from 'antd'
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

  const submit = ({ shortCode: value }: FormValues) => {
    setShortCode(value.trim())
    if (shortCode) data.refetch()
  }

  return (
    <Card className={styles.card} variant='borderless'>
      <div className={styles.heading}>
        <span className={styles.icon}>
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
              pattern: /^[A-Za-z0-9]{6,10}$/,
              message: '6–10 латинских букв или цифр',
            },
          ]}
        >
          <Input
            size='large'
            prefix={<SearchOutlined />}
            placeholder='abc123'
          />
        </Form.Item>
        <Button type='default' htmlType='submit' size='large'>
          Получить статистику
        </Button>
      </Form>
      {data.data && (
        <Descriptions className={styles.stats} column={1} size='small'>
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
      {data.error && (
        <Descriptions className={styles.stats} column={1} size='small'>
          <Descriptions.Item label='Переходы'>
            {data.error?.message}
          </Descriptions.Item>
        </Descriptions>
      )}
    </Card>
  )
}
