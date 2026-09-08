CREATE TABLE "urls" (
    "id" SERIAL NOT NULL,
    "short_code" VARCHAR(10) NOT NULL,
    "original_url" TEXT NOT NULL,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "urls_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "urls_short_code_key" ON "urls"("short_code");
