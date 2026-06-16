# Hariom Enterprises — Premium Paint Shop Website

A complete, production-ready dynamic paint shop website with admin panel and database.

**Stack:** Next.js 15 (App Router) · React 19 · Tailwind CSS · Node.js API routes · MySQL · Prisma ORM · JWT (jose) auth.

## Features

**Public site**
- Cinematic luxury hero, featured brands, categories, why-choose-us, testimonials, contact CTA
- Product catalog with DB-driven listing, search, brand filter, category filter, pagination
- Product detail page with image gallery, description, features, specifications, brand info
- Per-product inquiry form + WhatsApp button + Call Now button (floating + inline)
- Contact page with Google Maps embed, address, phone, email, WhatsApp
- Fully responsive, mobile-first, glassmorphism, smooth animations
- SEO: dynamic meta titles/descriptions, Open Graph, sitemap.xml, robots.txt, JSON-LD Product schema
- Performance: next/image optimization, lazy loading, SSR/dynamic rendering

**Admin panel** (`/admin`)
- Secure JWT login (HTTP-only cookie) + route middleware protection
- Dashboard with analytics (product/brand/inquiry counts, recent inquiries)
- Products: add / edit / delete, multi-image upload, assign brand, assign category, manage features & specifications
- Brands: add / edit / delete with logo upload
- Inquiry management with status (new/contacted/closed) and delete

## Database Schema (Prisma → MySQL)
- `brands` (id, brand_name, brand_logo, description, created_at)
- `products` (id, product_name, brand_id, category, image, images, description, features, specs, created_at)
- `inquiries` (id, customer_name, phone, email, message, product_id, status, created_at)
- `admins` (id, email, password [bcrypt], name, created_at)

## Local Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Create the database** in MySQL:
   ```sql
   CREATE DATABASE hariom_paints;
   ```

3. **Configure environment** — copy `.env.example` to `.env` and edit:
   ```
   DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/hariom_paints"
   JWT_SECRET="a-long-random-secret"
   NEXT_PUBLIC_SITE_URL="http://localhost:3000"
   NEXT_PUBLIC_WHATSAPP="91XXXXXXXXXX"      # digits only, with country code
   NEXT_PUBLIC_PHONE="+91XXXXXXXXXX"
   NEXT_PUBLIC_EMAIL="info@hariomenterprises.com"
   ```
   Also update the store address & map embed in `src/lib/config.js`.

4. **Push schema + seed sample data**
   ```bash
   npx prisma db push
   npm run db:seed
   ```
   Seed creates an admin and sample brands/products.

5. **Run**
   ```bash
   npm run dev
   ```
   - Site: http://localhost:3000
   - Admin: http://localhost:3000/admin/login

## Default Admin Login
- **Email:** admin@hariomenterprises.com
- **Password:** admin123
> Change this immediately. Create a new admin with a bcrypt-hashed password, or edit the seed and re-run.

## Image Uploads
Uploaded images are stored in `public/uploads/`. For production on serverless hosts (e.g. Vercel) the filesystem is read-only/ephemeral — switch the `/api/upload` route to a storage provider (AWS S3, Cloudflare R2, Cloudinary, etc.). On a VPS the local folder works as-is.

## Production Build
```bash
npm run build   # runs prisma generate + next build
npm start
```

## Deployment

### Option A — VPS (full features incl. local uploads)
1. Install Node 18+, MySQL.
2. Clone repo, set `.env`, run `npm install`.
3. `npx prisma db push && npm run db:seed`
4. `npm run build`
5. Run with PM2: `pm2 start npm --name hariom -- start`
6. Put Nginx in front as a reverse proxy to port 3000 and add SSL (Certbot).

### Option B — Vercel + managed MySQL (PlanetScale / Railway / Aiven)
1. Push to GitHub, import into Vercel.
2. Add env vars in Vercel project settings.
3. Set build command to `prisma generate && next build`.
4. Run `prisma db push` against the managed DB once (locally or via CI).
5. Replace local file upload with S3/R2/Cloudinary (see note above).

## Project Structure
```
prisma/schema.prisma     Database models
prisma/seed.js           Seed admin + sample data
src/lib/                 prisma client, auth (jose JWT), config
src/app/api/             REST API routes (auth, brands, products, inquiries, upload)
src/app/                 Public pages (home, products, product detail, about, contact)
src/app/admin/           Admin panel (login, dashboard, products, brands, inquiries)
src/components/          Navbar, Footer, ProductCard, InquiryForm, FloatingActions
src/middleware.js        Protects /admin routes
src/app/sitemap.js       Dynamic sitemap
src/app/robots.js        robots.txt
```

## Security Notes
- Admin routes protected by middleware + per-API `requireAuth()`.
- Passwords hashed with bcrypt; JWT signed and stored in HTTP-only cookie.
- Change `JWT_SECRET` and the default admin credentials before going live.

## Added Features (v2)
- **Colour Palettes** (`/colours`) — browsable colour gallery, filterable by family, with per-shade WhatsApp enquiry. Admin-managed at `/admin/colours` (add/edit/delete shades).
- **Colour Visualizer** (`/visualizer`) — preview colours on sample room scenes with adjustable strength and a custom colour picker. (See note below on a full AI version.)
- **Calculators** (`/calculators`) — paint quantity calculator (wall area, openings, coats, coverage, cost) and waterproofing calculator, each with WhatsApp send-estimate.
- New brands seeded: **Hariom Enterprises** (house brand), **Kamdhenu Paints**, **MRF Paints**, alongside the earlier samples.

### New database table
- `color_shades` (id, name, hex, family, created_at)

### Re-run after upgrading
Because the schema changed, run:
```
npx prisma db push
npm run db:seed
```
(`db push` adds the new color_shades table; re-seeding adds the new brands and sample shades. Seeding creates additional rows — if you already added your own data, you can skip re-seed and just add brands/shades from the admin panel instead.)

### About the "full AI room visualizer"
The included visualizer is a lightweight preview (colour overlay on sample scenes). A true "upload your own room photo and AI repaints only the walls" tool is a separate, larger build requiring a wall-segmentation/inpainting AI service (e.g. a hosted vision model), which incurs per-image cost and additional backend work. It is intentionally not wired in here. If you want it, it should be scoped as its own project with a chosen AI provider and budget.
