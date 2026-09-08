import {
  CopyOutlined,
  LinkOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons'
import { App, Button, Card, Form, Input, Typography } from 'antd'
import { useState } from 'react'
import styles from './ShortenUrlForm.module.scss'
import { useCreateShortenModel } from '../model'

type FormValues = { originalUrl: string }

export function ShortenUrlForm() {
  const [form] = Form.useForm<FormValues>()
  const [shortUrl, setShortUrl] = useState<string | null>(null)
  const { message } = App.useApp()
  const mutation = useCreateShortenModel({
    onSuccess(data) {
      setShortUrl(data?.shortUrl ?? '')
    },
  })

  const submit = (values: FormValues) => mutation.execute(values)

  const copyShortUrl = async () => {
    if (!shortUrl) return
    message.success('Ссылка скопирована')
    await navigator.clipboard.writeText(shortUrl)
  }

  return (
    <Card className={styles.card} variant='borderless'>
      <div className={styles.heading}>
        <span className={styles.icon}>
          <ThunderboltOutlined />
        </span>
        <div>
          <Typography.Title level={3}>Сократить ссылку</Typography.Title>
          <Typography.Text type='secondary'>
            Получите компактную ссылку за секунду
          </Typography.Text>
        </div>
      </div>
      <Form form={form} layout='vertical' onFinish={submit}>
        <Form.Item
          label='Оригинальная ссылка'
          name='originalUrl'
          rules={[
            { required: true, message: 'Введите ссылку' },
            { type: 'url', message: 'Введите корректный URL' },
            {
              validator: async (_, value: string) => {
                if (!value || /^https?:\/\//i.test(value)) return
                throw new Error('Разрешены только HTTP и HTTPS ссылки')
              },
            },
          ]}
        >
          <Input
            size='large'
            prefix={<LinkOutlined />}
            placeholder='https://example.com/article'
          />
        </Form.Item>
        <Button
          type='primary'
          htmlType='submit'
          size='large'
          block
          loading={mutation.isPending}
        >
          Сократить ссылку
        </Button>
      </Form>
      {shortUrl && (
        <div className={styles.result}>
          <Typography.Text type='secondary'>
            Ваша короткая ссылка
          </Typography.Text>
          <div className={styles.resultRow}>
            <a href={shortUrl} target='_blank' rel='noreferrer'>
              {shortUrl}
            </a>
            <Button icon={<CopyOutlined />} onClick={copyShortUrl}>
              Копировать
            </Button>
          </div>
        </div>
      )}
    </Card>
  )
}
