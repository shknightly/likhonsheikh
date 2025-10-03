# likhonsheikh Monorepo

likhonsheikh.com হল একটি বাংলা-প্রথম ব্লগিং প্ল্যাটফর্ম যেটি টেকসই সাবস্ক্রিপশন মডেলের উপর ভিত্তি করে তৈরি। এই মনোরেপোতে ওয়েব অ্যাপসহ ভবিষ্যতের সেবা গুলি PNPM ওয়ার্কস্পেসের মাধ্যমে মেইনটেইন করা হবে।

## প্যাকেজসমূহ

- `apps/web-app`: Next.js (TypeScript) ভিত্তিক গ্রাহকমুখী ওয়েব অ্যাপ যেখানে Geist Design System ও TailwindCSS ব্যবহার করা হয়েছে।

## দ্রুত শুরু

```bash
pnpm install
pnpm dev
```

## পরিবেশ ভেরিয়েবল

`.env.example` ফাইলটিতে সম্পূর্ণ লোকাল ডিফল্ট মান দেওয়া আছে। ডেভেলপমেন্ট শুরু করার আগে সেটিকে `.env.local` নামে কপি করুন এবং প্রয়োজনে মান পরিবর্তন করুন।

### Vercel পরিবেশ কনফিগারেশন

- Vercel Dashboard → Project Settings → **Environment Variables** এ গিয়ে Production, Preview ও Development—সব পরিবেশে মান সিঙ্ক করুন।
- Upstash (Redis/KV) সংক্রান্ত কীসমূহ: `KV_URL`, `KV_REST_API_URL`, `KV_REST_API_TOKEN`, `KV_REST_API_READ_ONLY_TOKEN`, `REDIS_URL`।
- Neon Postgres সংক্রান্ত কীসমূহ: `POSTGRES_URL`, `POSTGRES_PRISMA_URL`, `POSTGRES_HOST`, `NEON_PROJECT_ID`।
- ক্লায়েন্ট ফেসিং কনফিগারেশন: `NEXT_PUBLIC_STACK_PROJECT_ID`, প্রয়োজনে `NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`।
- সার্ভার সাইড সিক্রেট: `STACK_SECRET_SERVER_KEY`, `CLERK_SECRET_KEY` ইত্যাদি `.env.example` অনুসারে যোগ করুন।
- নতুন মান যোগ করলে অবশ্যই নতুন Deployment ট্রিগার করুন যাতে পরিবর্তন কার্যকর হয়।

## কোড স্টাইল ও নির্দেশনা

- TypeScript ব্যবহার বাধ্যতামূলক।
- অ্যাক্সেসিবিলিটি (WCAG 2.1 AA) মান বজায় রাখতে হবে।
- পারফরম্যান্স মেট্রিক: LCP < 2.5s, FID < 100ms, CLS < 0.1।
- Geist Design System অনুসারে UI গঠন করুন।

## লাইসেন্স

স্বত্ব © ২০২৪ likhonsheikh.com
