-- Add google_id column (nullable, unique)
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "google_id" TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS "User_google_id_key" ON "User"("google_id");
