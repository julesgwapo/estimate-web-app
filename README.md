# Estimate Web App Starter

A starter web app for converting the Excel/VBA estimating workbook into a proper website with login, projects, materials, and estimate building.

## Stack

- Next.js
- React
- Supabase Auth
- Supabase PostgreSQL
- Tailwind CSS

## Setup

1. Install Node.js.
2. Create a Supabase project.
3. In Supabase SQL Editor, run `supabase/schema.sql`.
4. Copy `.env.example` to `.env.local`.
5. Add your Supabase URL and anon key.
6. Run:

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Next build steps

1. Replace mock data with Supabase queries.
2. Import materials from the Excel workbook.
3. Add project CRUD forms.
4. Add estimate item save/load.
5. Rebuild each Excel/VBA calculator as a web module.
6. Add PDF export for client estimates.
