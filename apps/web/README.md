This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Debates Automation

This app includes a protected cron endpoint at `/api/cron/debates`.

- Method: `GET` or `POST`
- Auth: `Authorization: Bearer <CRON_SECRET>` or header `x-cron-secret: <CRON_SECRET>`
- Purpose: moves ended debates to `FINISHED` and promotes scheduled debates to `LIVE` when their `startAt` arrives

Local manual trigger example:

```bash
curl -X POST http://localhost:3000/api/cron/debates -H "Authorization: Bearer $CRON_SECRET"
```

Vercel cron is configured in `apps/web/vercel.json` to run daily (`0 3 * * *`) to stay compatible with Hobby plan limits.

To keep transitions automatic even on Hobby, the app also performs an on-demand sync whenever `/debates` and debate dashboard pages are requested.
