process.env.DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/url_shortener";
process.env.REDIS_URL = "redis://localhost:6379";
process.env.PORT = "3000";
process.env.BASE_URL = "http://localhost:3000";
process.env.REDIS_TTL_SECONDS = "3600";

// Node's Buffer is not exposed to dependencies loaded inside Jest's VM on some Node versions.
global.Buffer = Buffer;
