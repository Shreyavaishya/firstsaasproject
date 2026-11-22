# Pixora

Upload once, get media optimized and sized for every platform.

Stack: Next.js, Clerk (auth), Prisma + Neon Postgres, Cloudinary.

## Environment variables
DATABASE_URL, DATABASE_URL_POOL, NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, plus your Clerk keys.

## Run
npm install && npx prisma migrate deploy && npm run dev
