# Autora

Autora is a mobile-first, bilingual vehicle-maintenance assistant. It gives an owner one reliable answer to “What does my car need, and when?” while keeping mileage, schedules, service history, reminders, and expenses private to that owner.

## What is included

- Email/password registration and Auth.js sessions with bcrypt password hashing
- Strict server-side ownership checks for vehicles and all nested records
- Multi-vehicle garage and vehicle dashboards
- Editable maintenance schedules with distance, time, or combined triggers
- Centralized healthy / due soon / due / overdue status engine
- Transactional service recording, schedule advancement, reminders, expenses, and mileage updates
- Odometer history with decreasing-mileage protection
- Service history, expense totals, a lightweight six-month chart, and in-app reminders
- English/LTR and Persian/RTL UI, Persian digits, Jalali presentation/input, Gregorian input, and UTC-compatible database dates
- Light, dark, and system appearance modes
- Responsive application shell designed from 360px upward
- PostgreSQL schema, seed data, automated business-logic/ownership tests, PWA manifest, and localized SEO foundation

## Stack

Next.js App Router, TypeScript, Tailwind CSS, PostgreSQL, Prisma, Auth.js (`next-auth`), Zod, bcryptjs, date-fns-jalali, Vitest, and Vercel.

## Project structure

```text
app/
  (auth)/                 registration and login
  (protected)/            authenticated application routes
  actions.ts              validated server mutations
  api/auth/               Auth.js route handler
components/               shared mobile-first UI components
lib/                      auth, database, i18n, formatting, validation, calculations
prisma/
  schema.prisma           normalized PostgreSQL schema
  seed.ts                 development-only sample data
public/                    manifest and public assets
```

## Local setup

Requirements: Node.js 20.9+ and PostgreSQL 15+.

```bash
npm install
cp .env.example .env
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

On Windows PowerShell, use `Copy-Item .env.example .env` instead of `cp`.

Set a secure random value of at least 32 characters for both `AUTH_SECRET` and `NEXTAUTH_SECRET`. For local development, keep `AUTH_URL` and `NEXTAUTH_URL` set to `http://localhost:3000`.

The seed creates `demo@example.com` with password `Demo12345`. These credentials are development seed data only and are never displayed by the production application.

## Database workflow

```bash
npm run db:generate       # regenerate the Prisma client
npm run db:migrate        # create/apply a development migration
npm run db:deploy         # apply committed migrations in production
npm run db:seed           # load development sample data
```

The schema stores timestamps/dates in Gregorian database-native values. Jalali conversion and Persian-number formatting happen only in the presentation/input layer. Cascading foreign keys clean up vehicle-owned records, and all route queries add the authenticated owner ID.

## Quality checks

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

Tests cover distance and date status, combined “distance OR time” precedence, overdue detection, next-service calculation, localized numeric normalization, expense totals, and ownership query scoping.

## Production and Vercel

1. Create a PostgreSQL database suitable for serverless workloads (for example, a pooled Neon, Supabase, or Vercel Postgres connection).
2. Add `DATABASE_URL`, `AUTH_SECRET`, `NEXTAUTH_SECRET`, `AUTH_URL`, and `NEXTAUTH_URL` to the Vercel project. Production auth URLs must be the final HTTPS domain.
3. Run `npm run db:deploy` against the production database during release setup.
4. Import this repository into Vercel. The standard Next.js build command is `npm run build`; no persistent filesystem or continuously running process is required.
5. Never run the development seed against a production database.

For migrations, generate and review them locally with `npm run db:migrate`, commit `prisma/migrations`, then deploy with `npm run db:deploy`.

## Architecture notes

Server Components read protected data directly through Prisma after `requireUser()`. Mutations are Server Actions that validate FormData with Zod, scope every lookup through the authenticated user, and use Prisma transactions for multi-record workflows. UI components receive already-authorized data and never decide ownership. The maintenance engine in `lib/maintenance.ts` is the single source of truth for status and remaining distance/time.

The notification model supports in-app reminders now and can later feed push/email channels. Attachments are intentionally omitted; future receipts should use object storage. The app is PWA-ready but does not implement offline synchronization.

