# Oracle Eye Hospital website (Next.js + PostgreSQL)

Single Next.js folder: frontend + backend (API routes) together. DB = PostgreSQL via Prisma.

## Run it

```bash
npm install
cp .env.example .env        # then edit DATABASE_URL, ADMIN_PASSWORD, AUTH_SECRET
npm run db:push             # creates the tables in PostgreSQL
npm run db:seed             # optional: sample blog/news posts
npm run dev                 # http://localhost:3000
```

Admin panel: `/admin` (login with ADMIN_PASSWORD). Shows appointment requests (change status),
contact messages, and lets you publish blog / news posts.

## Where is what

| What | Where |
|---|---|
| Hospital info, phones, nav, doctors, services, FAQ, testimonials, gallery | `src/lib/content.js` |
| Home page (hero, services list, booking, doctors, FAQ) | `src/app/page.jsx` |
| Animated eye in hero | `src/components/EyeHero.jsx` |
| Appointment form | `src/components/AppointmentForm.jsx` -> `src/app/api/appointments/route.js` |
| Contact form | `src/app/contact-us/` -> `src/app/api/contact/route.js` |
| Admin panel | `src/app/admin/` + `src/app/api/admin/*` |
| Database tables | `prisma/schema.prisma` |
| Colours / fonts | `tailwind.config.js`, `src/app/globals.css` |

URLs follow the original site (`/overview`, `/doctor-team`, `/cashless-facility`, `/contact-us` ...).
Services are at `/services/<slug>` and doctors at `/doctors/<slug>`.

## Before going live: replace placeholders

- Doctor photos: put files in `public/images/doctors/` and set `photo` in `content.js`
- Gallery photos / YouTube IDs: `GALLERY`, `VIDEOS` in `content.js`
- Pages marked `TODO` (Chairman's message, Board, Charitable wings, Outreach, Internship, Awards, Publications, TPA list)
- Testimonials are samples, replace with real ones (with patient permission)
- Bios for Dr Rachana, Dr Ramesh Kumar Shukla and Dr Sujata Tomar are one-liners only
- Service pages contain general medical information, have your doctors review the wording
- Logo: the header uses a simple SVG mark, swap with the real logo in `src/components/Header.jsx`

## Deploy

Vercel/any Node host + hosted PostgreSQL (Neon, Supabase, Railway). Set the env variables from
`.env.example`, run `npx prisma db push` once against the production DB.
Set `NEXT_PUBLIC_SITE_URL` to the real domain for sitemap/SEO.

## Notes

- Spam protection: hidden honeypot field + server validation. Add rate limiting if you get abused.
- Admin is a single shared password with a signed httpOnly cookie. Fine for one clinic; use real accounts if several staff need separate logins.
