# MyGimp (starter)

Monorepo with a Vite React client and an Express + Prisma server.

Quick start:

1. Install dependencies (using pnpm recommended):

   pnpm install

2. Configure Postgres and set `server/.env` DATABASE_URL.

3. From `server/` run:

   npx prisma migrate dev --name init

4. Start both client and server in dev mode:

   pnpm --filter client dev
   pnpm --filter server dev
