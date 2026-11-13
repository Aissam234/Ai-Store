ALTER TABLE "User" ADD COLUMN "googleSub" VARCHAR(255), ALTER COLUMN "passwordHash" DROP NOT NULL;
CREATE UNIQUE INDEX "User_googleSub_key" ON "User"("googleSub");
CREATE TABLE "GoogleChallenge" ("nonce" CHAR(64) PRIMARY KEY, "expiresAt" TIMESTAMP(3) NOT NULL);
CREATE INDEX "GoogleChallenge_expiresAt_idx" ON "GoogleChallenge"("expiresAt");
