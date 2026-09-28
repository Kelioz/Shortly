# URL Shortener

## Технологии

Node.js, Express, TypeScript, Prisma, PostgreSQL, Redis, Zod, Swagger UI и Morgan.

## Docker Compose

Docker Compose поднимает PostgreSQL, Redis, backend и frontend. Миграции Prisma применяются
автоматически перед запуском backend:

```bash
docker compose up --build
```

После запуска:

- API: `http://localhost/api`
- Frontend: `http://localhost`
- Swagger: `http://localhost/docs`
- PostgreSQL: `localhost:5432`
- Redis: `localhost:6379`

В Docker наружу опубликован только стандартный HTTP-порт `80`:
`http://localhost`. Nginx проксирует API, Swagger и короткие ссылки во
внутренний backend-контейнер. Для этого режима Compose задаёт backend
`BASE_URL=http://localhost`, чтобы создаваемые короткие ссылки открывались через
nginx.

## Локальный запуск без Docker

Установите и запустите PostgreSQL и Redis локально, затем создайте файлы окружения:

- backend: [backend/.env.example](backend/.env.example) → `backend/.env`

Запуск backend:

```bash
cd .\backend
cp .env.example .env
npm install
npm run prisma:generate
npm run prisma:migrate:deploy
npm run dev
```

В отдельном терминале запустите frontend:

```bash
cd .\frontend
npm install
npm run dev
```

Локальный frontend доступен по адресу `http://localhost:5173` и отправляет API
запросы через Vite proxy на backend `http://localhost:3000`. В локальном режиме
backend использует `BASE_URL=http://localhost:3000` из `backend/.env.example`,
поэтому короткие ссылки ведут напрямую на backend. Не заменяйте это значение
на Docker-адрес `http://localhost`, если запускаете frontend через Vite.

## API

Примеры ниже относятся к Docker Compose, где frontend/nginx доступен на
`http://localhost`:

```bash
curl -X POST http://localhost/api/shorten \
  -H "Content-Type: application/json" \
  -d "{\"originalUrl\":\"https://example.com\"}"

curl -i http://localhost/abc123
curl http://localhost/api/stats/abc123
```

При локальном запуске без Docker обращайтесь напрямую к backend на порту `3000`:

```bash
curl -X POST http://localhost:3000/api/shorten \
  -H "Content-Type: application/json" \
  -d "{\"originalUrl\":\"https://example.com\"}"

curl -i http://localhost:3000/abc123
curl http://localhost:3000/api/stats/abc123
```

Пример ответа `POST /api/shorten`:

```json
{
  "shortCode": "abc123",
  "shortUrl": "http://localhost/abc123"
}
```

Пример ответа `GET /api/stats/abc123`:

```json
{
  "originalUrl": "https://example.com",
  "shortCode": "abc123",
  "clicks": 3,
  "createdAt": "2026-01-01T12:00:00.000Z"
}
```

`GET /:shortCode` читает URL из Redis с TTL один час. При промахе он загружает URL из PostgreSQL и помещает его в Redis; счетчик переходов увеличивается в PostgreSQL при каждом редиректе.

Если целевой URL совпадает с этой же короткой ссылкой, API возвращает `400`, не выполняя редирект и не увеличивая счетчик.

## Тесты

Backend API-тесты запускаются через Jest и Supertest:

```bash
cd .\backend
npm test
```

Тесты покрывают успешные запросы, валидацию, cache hit/cache miss, редирект,
коллизию короткого кода, защиту от циклического редиректа и статистику.

## Переменные окружения

| Переменная          | Назначение                             | Значение по умолчанию                                            |
| ------------------- | -------------------------------------- | ---------------------------------------------------------------- |
| `DATABASE_URL`      | Строка подключения Prisma к PostgreSQL | —                                                                |
| `REDIS_URL`         | Строка подключения к Redis             | —                                                                |
| `PORT`              | Порт HTTP-сервера                      | `3000`                                                           |
| `BASE_URL`          | Базовый URL для результата сокращения  | Docker: `http://localhost`; <br>локально:`http://localhost:3000` |
| `REDIS_TTL_SECONDS` | TTL URL в Redis                        | `3600`                                                           |
