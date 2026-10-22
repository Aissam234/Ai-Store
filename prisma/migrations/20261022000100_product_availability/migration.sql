-- Add an admin-managed, truthful product availability state.
CREATE TYPE "AvailabilityStatus" AS ENUM ('AVAILABLE', 'LIMITED', 'ASK_AVAILABILITY');
ALTER TABLE "Product" ADD COLUMN "availability" "AvailabilityStatus" NOT NULL DEFAULT 'AVAILABLE';
