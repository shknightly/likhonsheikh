AGENTS.md

AI agent guidelines for likhonsheikh.com — Bengali-first blogging platform with email publishing

---

Project Context

likhonsheikh.com is a sustainable, independent Bengali blogging platform built with Vue 3, Vite, and TailwindCSS in a PNPM monorepo. Core principles:

· Bengali-first: Primary language is বাংলা (Bangla), English is secondary
· Mobile-first: All UI must work perfectly on mobile before desktop
· Sustainable: No fundraising, no acquisition, no shutdown — pay-to-use model
· Performance: Target LCP <2.5s, FID <100ms, CLS <0.1
· Accessibility: WCAG 2.1 AA compliance minimum
· Geist Design System: Use Vercel's design system for consistent UI

---

Typography System

Font Stack

· Headlines: Noto Sans Bengali Bold
· Body: Noto Sans Bengali Regular
· UI Elements: Geist Sans
· Code: Geist Mono

Font Implementation

```javascript
// tailwind.config.js
export default {
  theme: {
    extend: {
      fontFamily: {
        'bangla-headline': ['Noto Sans Bengali', 'sans-serif'],
        'bangla-body': ['Noto Sans Bengali', 'serif'],
        'english-ui': ['Geist Sans', 'system-ui', 'sans-serif'],
        'code': ['Geist Mono', 'monospace'],
      },
      fontWeight: {
        'bangla-bold': 700,
        'bangla-regular': 400,
      },
    },
  },
}
```

---

Content Strategy

Initial Content Plan

Launch Content:

· Welcome post (Bengali + English)
· How to use guide for contributors
· 5 sample blog posts in various categories
· About page story
· Newsletter announcement

Categories:

· প্রযুক্তি (Technology)
· সাহিত্য (Literature)
· জীবনযাপন (Lifestyle)
· মতামত (Opinion)
· শিক্ষা (Education)

Content Roadmap

Phase 2 Features:

· Comments system (with moderation)
· Post reactions (like, love, etc.)
· Bookmarking functionality
· Reading progress indicator
· Related posts suggestions
· Author following system
· RSS feeds
· Multi-language support (beyond Bengali/English)

Phase 3 Features:

· Mobile apps (React Native)
· Podcast hosting
· Newsletter analytics dashboard
· A/B testing for headlines
· AI-powered writing assistant (Bengali)
· Collaborative editing
· Version history for posts
· Custom domains for contributors

---

Setup Commands

```bash
# Install dependencies (PNPM workspaces)
pnpm install

# Copy environment variables
cp .env.example .env.local

# Generate Prisma client
pnpm prisma generate

# Run database migrations
pnpm prisma migrate dev

# Seed initial data
pnpm prisma db seed

# Start all packages in dev mode
pnpm dev

# Start specific package
pnpm --filter web-app dev
pnpm --filter api-server dev

# Build all packages
pnpm build

# Run tests
pnpm test

# Run tests in watch mode
pnpm --filter web-app test:watch

# Lint
pnpm lint
```

---

Monorepo Structure

```
likhonsheikh/
├── packages/
│   ├── web-app/              # Main Vue 3 frontend
│   ├── admin-dashboard/      # Admin interface
│   ├── email-composer/       # Email publishing UI
│   ├── shared-ui/            # Geist Design System components
│   ├── shared-types/         # TypeScript types
│   ├── shared-utils/         # Common utilities
│   └── api-server/           # Backend API
├── apps/
│   └── landing/              # Marketing site
├── pnpm-workspace.yaml
├── turbo.json
└── vercel.json
```

Navigation tips:

· Use pnpm --filter <package-name> for specific packages
· Check package.json "name" field for exact filter names
· Use turbo run <command> for parallel execution
· From package root, just use pnpm <command>

---

Database Configuration

PostgreSQL (Neon) — Primary Database

```typescript
// lib/db.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

Environment variables (.env.local):

```bash
# Pooled connection (use for API routes)
DATABASE_URL="postgresql://neondb_owner:npg_JXLMY4oEZ6KC@ep-delicate-frost-aesfv1ke-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require"

# Direct connection (use for migrations)
DATABASE_URL_UNPOOLED="postgresql://neondb_owner:npg_JXLMY4oEZ6KC@ep-delicate-frost-aesfv1ke.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require"

# For Prisma (with connection timeout)
POSTGRES_PRISMA_URL="postgresql://neondb_owner:npg_JXLMY4oEZ6KC@ep-delicate-frost-aesfv1ke-pooler.c-2.us-east-2.aws.neon.tech/neondb?connect_timeout=15&sslmode=require"

# Alternative connection strings
POSTGRES_URL="postgresql://neondb_owner:npg_JXLMY4oEZ6KC@ep-delicate-frost-aesfv1ke-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require"
POSTGRES_URL_NON_POOLING="postgresql://neondb_owner:npg_JXLMY4oEZ6KC@ep-delicate-frost-aesfv1ke.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require"
```

Usage patterns:

· MUST: Use pooled connection (DATABASE_URL) for API routes
· MUST: Use direct connection (DATABASE_URL_UNPOOLED) for migrations and admin scripts
· MUST: Add connect_timeout=15 for production reliability

MongoDB (Optional Fallback)

```typescript
// lib/mongodb.ts
import { MongoClient, MongoClientOptions } from 'mongodb';
import { attachDatabasePool } from '@vercel/functions';

const uri = process.env.MONGODB_URI;
const options: MongoClientOptions = {
  appName: "likhonsheikh-blog",
};

let client: MongoClient;

if (uri) {
  if (process.env.NODE_ENV === 'development') {
    // Preserve client across HMR in development
    const globalWithMongo = global as typeof globalThis & {
      _mongoClient?: MongoClient;
    };

    if (!globalWithMongo._mongoClient) {
      client = new MongoClient(uri, options);
      globalWithMongo._mongoClient = client;
    }
    client = globalWithMongo._mongoClient;
  } else {
    // Production mode with proper cleanup
    client = new MongoClient(uri, options);
    
    // Attach for proper function suspension cleanup
    attachDatabasePool(client);
  }
}

export default client;
```

When to use MongoDB:

· SHOULD: Analytics data (page views, clicks)
· SHOULD: Real-time features (if needed)
· NEVER: Primary user/post/subscription data (use PostgreSQL)

Redis (Upstash) — Caching & Sessions

```typescript
// lib/redis.ts
import { Redis } from '@upstash/redis';

// Initialize with environment variables
export const redis = Redis.fromEnv();

// Alternative: Manual initialization
export const redisManual = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});
```

Environment variables:

```bash
KV_URL="rediss://default:ATRXAAIncDIxMTFiOWU3MjRjZDU0ZGYwOWE1ZDJhZWE4MTJlYmIzN3AyMTMzOTk@solid-cobra-13399.upstash.io:6379"
KV_REST_API_URL="https://solid-cobra-13399.upstash.io"
KV_REST_API_TOKEN="ATRXAAIncDIxMTFiOWU3MjRjZDU0ZGYwOWE1ZDJhZWE4MTJlYmIzN3AyMTMzOTk"
KV_REST_API_READ_ONLY_TOKEN="AjRXAAIgcDIAHRknUzk9JlXcW-QphBI4UpjFfahlw8GAZGLP88kXAg"
REDIS_URL="rediss://default:ATRXAAIncDIxMTFiOWU3MjRjZDU0ZGYwOWE1ZDJhZWE4MTJlYmIzN3AyMTMzOTk@solid-cobra-13399.upstash.io:6379"
```

Usage example:

```typescript
import { redis } from '@/lib/redis';

// Set value
await redis.set('key', 'value');

// Get value
const value = await redis.get<string>('key');

// Set with expiry (in seconds)
await redis.setex('session:123', 3600, 'session-data');

// Cache pattern for posts
const cached = await redis.get<Post>(`post:${postId}`);
if (cached) return cached;

const post = await prisma.post.findUnique({ where: { id: postId } });
await redis.setex(`post:${postId}`, 3600, JSON.stringify(post));
return post;
```

MUST use Redis for:

· Session storage
· Rate limiting
· API response caching (5-15 minutes)
· Real-time counters (views, likes)
· Queue management for email sending

---

Code Style

TypeScript

· MUST: Strict mode enabled, all type checks must pass
· NEVER: Use any types (use unknown with type guards)
· MUST: Explicit return types on all functions
· MUST: Named exports over default exports

Vue 3 Composition API

```vue
<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Post } from '@/types';

// Props with TypeScript
interface Props {
  post: Post;
  isEditable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isEditable: false,
});

// Emits
const emit = defineEmits<{
  update: [post: Post];
  delete: [id: string];
}>();

// Reactive state
const isLoading = ref(false);
const editedContent = ref(props.post.content);

// Computed
const wordCount = computed(() => 
  editedContent.value.split(/\s+/).length
);
</script>
```

File Naming

· Components: PascalCase (BlogPost.vue, UserAvatar.vue)
· Composables: camelCase with use prefix (useAuth.ts, usePosts.ts)
· Utils: camelCase (formatDate.ts, slugify.ts)
· Types: PascalCase (User.ts, Post.ts)
· API routes: kebab-case (get-posts.ts, create-user.ts)

Import Order

```typescript
// 1. Vue imports
import { ref, computed } from 'vue';

// 2. Third-party libraries
import { useRouter } from 'vue-router';

// 3. Local composables and stores
import { useAuthStore } from '@/stores/auth';

// 4. Components
import BlogPost from '@/components/BlogPost.vue';

// 5. Types
import type { Post, User } from '@/types';

// 6. Utils
import { formatDate } from '@/utils/date';
```

---

Bengali Language Support

Font Implementation

TailwindCSS config (tailwind.config.js):

```javascript
export default {
  theme: {
    extend: {
      fontFamily: {
        bangla: ['Noto Sans Bengali', 'Hind Siliguri', 'sans-serif'],
        english: ['Geist Sans', 'system-ui', 'sans-serif'],
        mono: ['Geist Mono', 'monospace'],
      },
    },
  },
};
```

Font loading (in index.html or layout):

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

CSS setup (in main.css):

```css
@font-face {
  font-family: 'Bangla Primary';
  src: local('Noto Sans Bengali'),
       url('/fonts/NotoSansBengali-Regular.woff2') format('woff2');
  font-display: swap;
  unicode-range: U+0980-09FF; /* Bengali Unicode block */
}

body {
  font-family: 'Noto Sans Bengali', 'Geist Sans', system-ui, sans-serif;
  line-height: 1.6; /* Better for Bengali conjuncts */
}

.content-bangla {
  font-family: 'Noto Sans Bengali', sans-serif;
  line-height: 1.7;
  word-break: break-word;
}

.content-english {
  font-family: 'Geist Sans', system-ui, sans-serif;
  line-height: 1.5;
}
```

Usage in components:

```vue
<template>
  <input
    v-model="title"
    type="text"
    placeholder="শিরোনাম লিখুন..."
    class="font-bangla"
    lang="bn"
  />
</template>
```

MUST:

· Preload critical Bengali fonts in HTML head
· Use font-display: swap to prevent FOIT
· Set line-height: 1.6-1.7 for Bengali (better for conjuncts)
· Always provide Bengali placeholders for Bengali-primary fields
· Use lang="bn" attribute on Bengali content

---

Interactions

Keyboard

· MUST: Full keyboard support per WAI-ARIA APG
· MUST: Visible focus rings (:focus-visible; group with :focus-within)
· MUST: Manage focus (trap, move, and return) per APG patterns

Targets & Input

· MUST: Hit target ≥24px (mobile ≥44px). If visual <24px, expand hit area
· MUST: Mobile <input> font-size ≥16px or set:
  ```html
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover">
  ```
· NEVER: Disable browser zoom
· MUST: touch-action: manipulation to prevent double-tap zoom
· MUST: Set -webkit-tap-highlight-color to match design

Forms (Behavior)

· MUST: Hydration-safe inputs (no lost focus/value)
· NEVER: Block paste in <input>/<textarea>
· MUST: Loading buttons show spinner and keep original label
· MUST: Enter submits focused text input. In <textarea>, ⌘/Ctrl+Enter submits; Enter adds newline
· MUST: Keep submit enabled until request starts; then disable, show spinner, use idempotency key
· MUST: Don't block typing; accept free text and validate after
· MUST: Allow submitting incomplete forms to surface validation
· MUST: Errors inline next to fields; on submit, focus first error
· MUST: autocomplete + meaningful name; correct type and inputmode
· SHOULD: Disable spellcheck for emails/codes/usernames
· SHOULD: Placeholders end with ellipsis and show example pattern (e.g., +1 (123) 456-7890, sk-012345…)
· MUST: Warn on unsaved changes before navigation
· MUST: Compatible with password managers & 2FA; allow pasting one-time codes
· MUST: Trim values to handle text expansion trailing spaces
· MUST: No dead zones on checkboxes/radios; label+control share one generous hit target

State & Navigation

· MUST: URL reflects state (deep-link filters/tabs/pagination/expanded panels). Prefer libs like nuqs
· MUST: Back/Forward restores scroll
· MUST: Links are links—use <a>/<Link> for navigation (support Cmd/Ctrl/middle-click)

Feedback

· SHOULD: Optimistic UI; reconcile on response; on failure show error and rollback or offer Undo
· MUST: Confirm destructive actions or provide Undo window
· MUST: Use polite aria-live for toasts/inline validation
· SHOULD: Ellipsis (…) for options that open follow-ups (e.g., "Rename…")

Touch/Drag/Scroll

· MUST: Design forgiving interactions (generous targets, clear affordances; avoid finickiness)
· MUST: Delay first tooltip in a group; subsequent peers no delay
· MUST: Intentional overscroll-behavior: contain in modals/drawers
· MUST: During drag, disable text selection and set inert on dragged element/containers
· MUST: No "dead-looking" interactive zones—if it looks clickable, it is

Autofocus

· SHOULD: Autofocus on desktop when there's a single primary input
· SHOULD: Rarely autofocus on mobile (to avoid layout shift)

---

Animation

· MUST: Honor prefers-reduced-motion (provide reduced variant)
· SHOULD: Prefer CSS > Web Animations API > JS libraries
· MUST: Animate compositor-friendly props (transform, opacity); avoid layout/repaint props (top/left/width/height)
· SHOULD: Animate only to clarify cause/effect or add deliberate delight
· SHOULD: Choose easing to match the change (size/distance/trigger)
· MUST: Animations are interruptible and input-driven (avoid autoplay)
· MUST: Correct transform-origin (motion starts where it "physically" should)

---

Layout

· SHOULD: Optical alignment; adjust by ±1px when perception beats geometry
· MUST: Deliberate alignment to grid/baseline/edges/optical centers—no accidental placement
· SHOULD: Balance icon/text lockups (stroke/weight/size/spacing/color)
· MUST: Verify mobile, laptop, ultra-wide (simulate ultra-wide at 50% zoom)
· MUST: Respect safe areas (use env(safe-area-inset-*))
· MUST: Avoid unwanted scrollbars; fix overflows

---

Content & Accessibility

· SHOULD: Inline help first; tooltips last resort
· MUST: Skeletons mirror final content to avoid layout shift
· MUST: <title> matches current context
· MUST: No dead ends; always offer next step/recovery
· MUST: Design empty/sparse/dense/error states
· SHOULD: Curly quotes (" "); avoid widows/orphans
· MUST: Tabular numbers for comparisons (font-variant-numeric: tabular-nums or Geist Mono)
· MUST: Redundant status cues (not color-only); icons have text labels
· MUST: Don't ship the schema—visuals may omit labels but accessible names still exist
· MUST: Use the ellipsis character … (not ...)
· MUST: scroll-margin-top on headings for anchored links; include a "Skip to content" link; hierarchical <h1–h6>
· MUST: Resilient to user-generated content (short/avg/very long)
· MUST: Locale-aware dates/times/numbers/currency
· MUST: Accurate names (aria-label), decorative elements aria-hidden, verify in the Accessibility Tree
· MUST: Icon-only buttons have descriptive aria-label
· MUST: Prefer native semantics (button, a, label, table) before ARIA
· SHOULD: Right-clicking the nav logo surfaces brand assets
· MUST: Use non-breaking spaces to glue terms: 10&nbsp;MB, ⌘&nbsp;+&nbsp;K, Vercel&nbsp;SDK

---

Performance

· SHOULD: Test iOS Low Power Mode and macOS Safari
· MUST: Measure reliably (disable extensions that skew runtime)
· MUST: Track and minimize re-renders (React DevTools/React Scan)
· MUST: Profile with CPU/network throttling
· MUST: Batch layout reads/writes; avoid unnecessary reflows/repaints
· MUST: Mutations (POST/PATCH/DELETE) target <500 ms
· SHOULD: Prefer uncontrolled inputs; make controlled loops cheap (keystroke cost)
· MUST: Virtualize large lists (e.g., virtua)
· MUST: Preload only above-the-fold images; lazy-load the rest
· MUST: Prevent CLS from images (explicit dimensions or reserved space)

Performance Targets (likhonsheikh.com specific)

· MUST: LCP <2.5s
· MUST: FID <100ms
· MUST: CLS <0.1
· MUST: FCP <1.8s
· MUST: TTFB <600ms

---

Design (Geist Design System)

· SHOULD: Layered shadows (ambient + direct)
· SHOULD: Crisp edges via semi-transparent borders + shadows
· SHOULD: Nested radii: child ≤ parent; concentric
· SHOULD: Hue consistency: tint borders/shadows/text toward bg hue
· MUST: Accessible charts (color-blind-friendly palettes)
· MUST: Meet contrast—prefer APCA over WCAG 2
· MUST: Increase contrast on :hover/:active/:focus
· SHOULD: Match browser UI to bg
· SHOULD: Avoid gradient banding (use masks when needed)

Geist-Specific Guidelines

· MUST: Use Geist Sans for English UI text
· MUST: Use Geist Mono for code/numbers
· MUST: Follow Geist spacing scale (4px base unit)
· MUST: Use Geist gray scale (gray-50 to gray-1000)
· MUST: Dark mode as default theme
· SHOULD: Reference Geist Design System docs

---

Testing

```bash
# Run all tests
pnpm test

# Run tests for specific package
pnpm --filter web-app test

# Watch mode
pnpm --filter web-app test:watch

# Coverage
pnpm test:coverage

# Specific test file
pnpm vitest run -t "BlogPost"

# E2E tests
pnpm test:e2e
```

Unit Tests (Vitest + Testing Library)

```typescript
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import BlogPost from './BlogPost.vue';

describe('BlogPost', () => {
  it('renders Bengali title correctly', () => {
    const wrapper = mount(BlogPost, {
      props: {
        post: {
          id: '1',
          titleBangla: 'পরীক্ষা শিরোনাম',
          content: 'Content here',
        },
      },
    });
    
    expect(wrapper.text()).toContain('পরীক্ষা শিরোনাম');
  });
});
```

Test Requirements

· MUST: Every component must have tests
· MUST: Test Bengali text handling (Unicode)
· MUST: Test mobile viewports
· MUST: Accessibility tests using axe
· MUST: Visual regression tests (Playwright screenshots)

---

API Conventions

Response Format

```typescript
// Success
{
  "success": true,
  "data": { /* response data */ },
  "message": "অপারেশন সফল হয়েছে" // Bengali message
}

// Error
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "ইনপুট যাচাই ব্যর্থ হয়েছে",
    "details": [/* validation errors */]
  }
}
```

API Example with Caching

```typescript
import { prisma } from '@/lib/db';
import { redis } from '@/lib/redis';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Check cache first
    const cached = await redis.get('posts:list');
    if (cached) {
      return res.status(200).json({
        success: true,
        data: JSON.parse(cached as string),
        cached: true,
      });
    }

    // Fetch from database
    const posts = await prisma.post.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { publishedAt: 'desc' },
      take: 20,
    });

    // Cache for 5 minutes
    await redis.setex('posts:list', 300, JSON.stringify(posts));

    return res.status(200).json({ success: true, data: posts });
  }
}
```

---

Security

Input Validation (Zod)

```typescript
import { z } from 'zod';

const createPostSchema = z.object({
  titleBangla: z.string().min(1).max(200),
  title: z.string().min(1).max(200).optional(),
  content: z.string().min(1),
  status: z.enum(['DRAFT', 'PUBLISHED', 'SCHEDULED']),
});

const validated = createPostSchema.safeParse(req.body);
if (!validated.success) {
  return res.status(400).json({
    success: false,
    error: {
      code: 'VALIDATION_ERROR',
      details: validated.error.errors,
    },
  });
}
```

Rate Limiting

```typescript
import { Ratelimit } from '@upstash/ratelimit';
import { redis } from '@/lib/redis';

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '10 s'),
});

const { success } = await ratelimit.limit(req.ip || 'anonymous');
if (!success) {
  return res.status(429).json({
    success: false,
    error: { code: 'RATE_LIMIT_EXCEEDED' },
  });
}
```

---

Commit Conventions

Format

```
<type>(<scope>): <subject>

Examples:
feat(blog): add Bengali text search
fix(auth): prevent token refresh loop
perf(posts): add Redis caching layer
```

Types

· feat: New feature
· fix: Bug fix
· docs: Documentation only
· style: Code style (no logic change)
· refactor: Code refactoring
· perf: Performance improvements
· test: Adding/updating tests
· chore: Maintenance tasks

Pre-commit

```bash
pnpm lint && pnpm test && pnpm build
```

---

PR Instructions

· Title format: [<package>] <Type>: <Description>
· Examples:
  · [web-app] feat: add post editor with Bengali support
  · [api-server] fix: handle Redis connection errors
· MUST: Run pnpm lint && pnpm test before committing
· MUST: Update tests for code changes
· MUST: Verify mobile responsiveness
· MUST: Test with Bengali content
· MUST: Check accessibility (keyboard nav, screen readers)

---

Deployment Configuration

Vercel Setup

· Preview deployments for all PRs
· Production deployment on main branch
· Environment variables per environment
· Custom domains setup

Environment Strategy

```bash
# Development
.env.local

# Preview (PR)
.env.preview

# Production  
.env.production
```

---

Analytics & Monitoring

Tracking Implementation

1. Vercel Analytics
   · Page views
   · User sessions
   · Web Vitals
   · Custom events
2. Custom Events to Track
   · Post published
   · Email subscription
   · Payment completed
   · Share button clicked
   · Comment submitted (Phase 2)
3. Error Tracking
   · Sentry for error reporting
   · Breadcrumbs for debugging
   · Source maps for production
   · Alert notifications

---

Launch Checklist

Pre-Launch Tasks

Technical:

· Complete all core features
· Security audit
· Performance optimization
· Cross-browser testing
· Mobile responsiveness check
· Accessibility audit (WCAG 2.1 AA)
· SEO optimization
· Backup strategy implemented
· Monitoring and alerts setup
· Legal pages (Terms, Privacy, Refund)

Content:

· Landing page copy (Bangla + English)
· Sample blog posts
· Email templates designed
· Documentation for contributors
· Help center articles

Business:

· Stripe account setup
· Pricing finalized
· Domain purchased and configured
· Email domain authentication (SPF, DKIM, DMARC)
· Social media accounts created
· Launch announcement prepared

---

Support & Maintenance

Error Handling

```typescript
// Global error handler
const handleError = (error: unknown, context: string) => {
  console.error(`[${context}]`, error);
  
  // Send to Sentry in production
  if (process.env.NODE_ENV === 'production') {
    Sentry.captureException(error, { tags: { context } });
  }
  
  // User-friendly error messages in Bengali
  return {
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'দুঃখিত, একটি সমস্যা হয়েছে। দয়া করে পরে আবার চেষ্টা করুন।',
    }
  };
};
```

Monitoring

· MUST: Set up uptime monitoring
· MUST: Monitor database connection pools
· MUST: Track API response times
· MUST: Monitor Redis memory usage
· MUST: Set up alerts for critical errors

---

This AGENTS.md provides complete guidelines for developing likhonsheikh.com with all technical specifications, design systems, content strategy, and deployment procedures. 🚀
