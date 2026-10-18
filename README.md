# Nexora digital store

Existing Next.js App Router storefront with a PostgreSQL/Prisma backend, customer accounts, and server-authorized administration. The V1 dark design and browser-local cart are preserved. Orders are completed manually on WhatsApp. Online payments and automated digital delivery are intentionally not implemented.

## Local setup

Use Node.js 24 LTS and npm (the existing lockfile is retained).

1. Install dependencies with `npm ci`. This generates the Prisma client.
2. Copy `.env.example` to `.env.local` and set `DATABASE_URL` to an existing PostgreSQL database. Do not commit credentials.
3. Optionally use the included Docker database: set `POSTGRES_PASSWORD` and the matching `DATABASE_URL` (port 55432), then run `docker compose --env-file .env.local up -d --wait`. Run `npm run db:migrate` to apply the checked-in migrations.
4. Run `npm run db:seed` to import the original eight demo products and four categories.
5. Run `npm run dev`, then open http://localhost:3000.

For a production preview: `npm run build`, then `npm start`. Use HTTPS for authentication in production. `SESSION_COOKIE_SECURE` defaults to true in production and false in development. For local HTTP/LAN testing only, set it to `false`. To view on a phone on the same network, run `npm run dev -- --hostname 0.0.0.0` and open the computer's LAN address on port 3000.

The build deliberately does not connect to PostgreSQL: catalog and private data are loaded at request time behind loading boundaries. A passing build is not a database runtime test. With no `DATABASE_URL`, generation/validation/build work, but catalog queries, registration, authentication, checkout persistence, and administration require database setup. There is no mock-data fallback.

## Initial administrator

Before seeding, optionally set `INITIAL_ADMIN_EMAIL`, `INITIAL_ADMIN_PASSWORD`, and `INITIAL_ADMIN_NAME`. The password must contain 15–128 characters. Set both email and password, or neither; no default administrator/password exists. Public registration always creates a `CUSTOMER`.

The seed creates a new `ADMIN` only for an unused email. It refuses to promote an existing customer or overwrite an existing password. Re-running with the same valid admin credentials is safe. Remove initial-admin credentials from the environment after provisioning. Product/category upserts only insert missing IDs and do not overwrite admin edits. Product IDs `p1`–`p8` are preserved for existing localStorage carts.

## Routes and behavior

- `/login`, `/register`, `/account`: email/password authentication, sign-out, and customer-owned checkout draft history.
- `/admin`: dashboard; `/admin/products` and `/admin/categories`: create/read/update/delete; `/admin/orders` and `/admin/orders/[id]`: paginated unpaid drafts and their immutable item snapshots.
- Admin access is checked in the server layout, data access helpers, and every admin mutation. Customer roles are read from PostgreSQL each request. Hiding links is not an authorization boundary.
- The cart stores unique product IDs only. Deleted/hidden products are shown as unavailable with removal controls.
- The customer checkout now opens a WhatsApp message with the current catalog selection. Sending a message does not automatically create an order or collect payment. The retained backend draft API requires sign-in and explicitly saves an **unpaid DRAFT**. The server validates IDs/customer fields with Zod, fetches current active products inside a serializable transaction, and calculates totals from integer database prices in MAD centimes. It never accepts client prices, totals, roles, or user IDs. User-scoped idempotency keys prevent duplicate drafts on retries. Drafts are not payments, reservations, licenses, or download entitlements.
- Product deletion preserves order-item names, slugs, and prices. Categories with products cannot be deleted until products are reassigned.

## Code locations

- `prisma/schema.prisma`, `prisma/migrations/`: schema, foreign keys, indexes, and money/quantity constraints.
- `prisma/seed-data.ts`: the only static product dataset, used only by the seed.
- `src/server/catalog.ts`: database-backed product/category reads and safe storefront DTOs.
- `src/server/auth.ts`: opaque sessions with hashed tokens, HttpOnly/SameSite cookies, expiry, rotation at sign-in, and revocation at sign-out.
- `src/lib/password.ts`: salted native scrypt hashes using the [OWASP 32 MiB / 3-pass profile](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html#scrypt). No plaintext passwords are stored.
- `src/actions/`: validated server mutations. Next.js Server Actions provide same-origin checks; no permissive origin override is configured.
- `src/server/rate-limit.ts`: database-backed email/account and global fixed-window throttling before expensive auth work. Shared limits apply across app instances; expired buckets are cleaned up. Add proxy-level abuse protection for a public production deployment.
- `src/config/store.ts`: edit `whatsappNumber` (international digits only, no `+`) to change the recipient everywhere. Shared brand and currency also live here.
- `/admin/products`: add/edit products, upload JPEG/PNG/WebP images up to 3 MB, optional original prices and badges, enable/disable, or delete with confirmation. Additional existing product fields remain under Additional product details.
- Images are decoded and normalized to WebP (maximum 1600px) and stored in PostgreSQL with the product. Catalog queries omit binary data; a dedicated image route serves active products publicly and inactive ones only to administrators. Back up the database to preserve images.
- `src/lib/whatsapp.ts`: centralized dynamic order-message formatting.

Email verification, password recovery, real payments, and digital delivery remain outside this foundation. The support address is still a demo placeholder. Accounts store email/password credentials and drafts store submitted customer information; no email is sent.

## Validation

```bash
npm run db:generate
npm run db:validate
npm test
npm run lint
npm run build
```

`npm test` covers password hashing, validation/role injection, exact price conversion, duplicate/unavailable items, order totals, snapshot isolation, and seed compatibility. These tests do not claim to exercise a live database.

After configuring PostgreSQL, verify migrations and seeding, customer registration/sign-in/sign-out, customer denial of every admin route/action, admin CRUD, saved carts, and a checkout draft whose total matches the database after changing a product price. Confirm the draft is visible only in its owner's account and to administrators.

## Languages

The storefront supports English (`en`), French (`fr`), Arabic (`ar`), and Moroccan Darija (`ma`). The navbar stores the selection in the `ai-store-locale` cookie; English is the fallback. Arabic and Darija use RTL. Darija uses the BCP 47 HTML language tag `ary` while retaining `ma` as the application locale key.

Before running this version against an existing database, run `npm run db:migrate`. Migration `20261018000100_product_translations` adds eight nullable product fields without replacing existing content. In Admin → Products → Add/Edit, use the grouped translation sections to set localized names and short descriptions. Missing text falls back to English, then the existing product value. Other product content remains owner-managed.

Shared UI translations live in `src/i18n/messages.json`; locale resolution and product fallback logic live in `src/i18n/config.ts`. Routes stay unchanged. The cached HTML shell applies language/direction before paint, while server-rendered content and metadata use the locale cookie. WhatsApp messages use the selected language and retain MAD prices and the configured recipient.
