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

- API: `http://localhost:3000`
- Frontend: `http://localhost:5173`
- Swagger: `http://localhost:3000/docs`
- PostgreSQL: `localhost:5432`
- Redis: `localhost:6379`

## Локальный запуск без Docker

Установите и запустите PostgreSQL и Redis локально, затем создайте файлы окружения:

- backend: [backend/.env.example](backend/.env.example) → `backend/.env`
- frontend: [frontend/.env.example](frontend/.env.example) → `frontend/.env`

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
cp .env.example .env
npm install
npm run dev
```

## API

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
  "shortUrl": "http://localhost:3000/abc123"
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

| Переменная          | Назначение                             | Значение по умолчанию   |
| ------------------- | -------------------------------------- | ----------------------- |
| `DATABASE_URL`      | Строка подключения Prisma к PostgreSQL | —                       |
| `REDIS_URL`         | Строка подключения к Redis             | —                       |
| `PORT`              | Порт HTTP-сервера                      | `3000`                  |
| `BASE_URL`          | Базовый URL для результата сокращения  | `http://localhost:3000` |
| `REDIS_TTL_SECONDS` | TTL URL в Redis                        | `3600`                  |
