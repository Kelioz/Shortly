# URL Shortener

## Технологии

Node.js, Express, TypeScript, Prisma, PostgreSQL, Redis, Zod, Swagger UI и Morgan.

## Docker Compose

Docker Compose поднимает PostgreSQL, Redis, backend и frontend. Миграции Prisma применяются
автоматически перед запуском backend:

```bash
cd .\backend

docker compose up --build
```

После запуска:

- API: `http://localhost:3000`
- Frontend: `http://localhost:5173`
- Swagger: `http://localhost:3000/docs`
- PostgreSQL: `localhost:5432`
- Redis: `localhost:6379`

## API

```bash
curl -X POST http://localhost:3000/api/shorten \
  -H "Content-Type: application/json" \
  -d "{\"originalUrl\":\"https://example.com\"}"

curl -i http://localhost:3000/abc123
curl http://localhost:3000/api/stats/abc123
```

`GET /:shortCode` читает URL из Redis с TTL один час. При промахе он загружает URL из PostgreSQL и помещает его в Redis; счетчик переходов увеличивается в PostgreSQL при каждом редиректе.

## Переменные окружения

| Переменная          | Назначение                             | Значение по умолчанию   |
| ------------------- | -------------------------------------- | ----------------------- |
| `DATABASE_URL`      | Строка подключения Prisma к PostgreSQL | —                       |
| `REDIS_URL`         | Строка подключения к Redis             | —                       |
| `PORT`              | Порт HTTP-сервера                      | `3000`                  |
| `BASE_URL`          | Базовый URL для результата сокращения  | `http://localhost:3000` |
| `REDIS_TTL_SECONDS` | TTL URL в Redis                        | `3600`                  |
