# OG Studios.Tech

Production-oriented technology studio website built with Next.js, TypeScript and Supabase/PostgreSQL. The site intentionally avoids fixed public pricing and invented social proof.

## Stack

- Next.js App Router + TypeScript
- Supabase Auth, PostgreSQL and private Storage
- Zod server/client validation
- Framer Motion for restrained motion
- Optional Resend email notifications
- Optional analytics via `NEXT_PUBLIC_ANALYTICS_ID`

## Local setup

1. Install Node.js 20+.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local`.
4. Create a Supabase project.
5. Put the Supabase URL, anon key and service-role key in `.env.local`.
6. Run `supabase/migrations/001_initial.sql` in the Supabase SQL editor or through the Supabase CLI.
7. Create the first admin user in Supabase Authentication > Users.
8. Copy that user's UUID and run `insert into public.admins(user_id) values ('UUID');` in SQL.
9. Optionally configure Resend, business email and analytics.
10. Run `npm run dev`.

## Admin

Open `/admin/login` and sign in with the Supabase Auth user that was inserted into `public.admins`. The dashboard manages projects, workshops, enquiry statuses and studio settings. Admin API routes verify the authenticated session and admin membership; no password is hardcoded.

## Project enquiries / attachments

The project wizard submits to `/api/project-enquiries`. The optional attachment is validated to PDF/JPG/PNG/WebP and max 8 MB, then stored in the private `project-attachments` bucket. The database stores only the private storage path.

## Email

Set `RESEND_API_KEY` and `BUSINESS_EMAIL` to enable notifications. Without these values, form submissions still go to the database; email notification is simply disabled. Replace the default Resend sender in `lib/email.ts` with a verified domain sender before production.

## Rate limiting / spam

Forms include a honeypot and server-side best-effort IP rate limiting. For horizontally scaled production deployments, replace/augment `lib/rate-limit.ts` with an Upstash Redis implementation using the provided environment variables.

## Vercel deployment

1. Push this repository to GitHub.
2. Import the repository into Vercel.
3. Add every variable from `.env.example` that you use.
4. Set `NEXT_PUBLIC_SITE_URL` to your production domain.
5. Deploy.
6. In your DNS provider, point the domain to Vercel using the records Vercel provides.
7. In Supabase Authentication URL configuration, set the production site URL and allowed redirect URLs to the production domain.
8. Verify `/admin/login`, project submission, contact, workshop registration and attachment upload in production.

## Email configuration

Create a Resend account, verify the production sending domain, set `RESEND_API_KEY` and `BUSINESS_EMAIL`, and update `lib/email.ts` to use the verified sender address.

## Analytics

Set `NEXT_PUBLIC_ANALYTICS_ID` to enable the lightweight gtag integration. For privacy-sensitive deployments, configure consent management before enabling analytics.

## Production checks

Run:

```bash
npm run build
npm run start
```

Then manually test: home navigation, project detail route, 404, project enquiry with and without attachment, contact form, workshop registration, admin login/logout, project/workshop CRUD, enquiry status changes and mobile layouts.

## Content

Projects and workshops are database-managed. The technology ecosystem is configured in `app/page.tsx` and can be moved to a database/settings table if non-developer editing of the stack becomes necessary.


## Production checklist

Before launch, set a real `NEXT_PUBLIC_SITE_URL`, run the Supabase migration, create at least one admin user, publish only the projects intended for public display, configure email/analytics intentionally, and verify every form and workshop flow in the production environment.
