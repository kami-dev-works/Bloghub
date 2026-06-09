# BlogHub

A bilingual (English + Hindi) full-stack content platform combining a blog/news publishing system with a services marketplace. Built with Astro 5 SSR + React 18 SPA hydration and an Express/MongoDB REST API.

## Architecture

```
Browser ──► Astro SSR (Node) :4321 ──fetch /api, /uploads──► Express API (Node) :5000 ──► MongoDB
              │                                                      │
              └── SSR HTML + JSON-LD + meta tags                     └── JWT auth, file uploads,
              └── React SPA hydration                                  image processing, rate limiting
```

Two independent Node processes cooperate via a reverse proxy (dev: Vite proxy; production: nginx/Caddy). The Astro server handles SEO (SSR HTML, JSON-LD, sitemap, RSS, hreflang), then hands interactivity to a React SPA. The Express backend owns all data, auth, uploads, and security.

## Tech Stack

| Layer | Technology |
|---|---|
| SSR Shell | Astro 5 + @astrojs/node adapter |
| Frontend | React 18, MUI 5, react-router-dom 6 |
| Backend | Express 4, Mongoose 8, MongoDB |
| Auth | JWT + bcryptjs |
| Image Processing | Sharp (WebP q80 + AVIF q60) |
| Animations | Framer Motion |
| Rich Text | CKEditor 5 (admin), React-Quill (users) |

## Features

- **Blog system** — CRUD, submissions, approval workflow, comments, tags, categories, SEO fields
- **Services marketplace** — listings, pricing, ratings, reviews, featured toggle
- **SEO complete** — SSR JSON-LD (Organization, WebSite, NewsArticle, BreadcrumbList, CollectionPage, FAQPage, Speakable), unified sitemap (image + news namespaces), RSS feed, IndexNow, hreflang en/hi, canonical URLs, robots.txt, security headers
- **Theme system** — 18 presets, 24 color keys × 2 modes (light/dark), live preview, CSS variables
- **Multilingual** — English + Hindi toggle, Devanagari slug support
- **Admin dashboard** — KPIs, user management, blog/service CRUD, slider/ads/notifications, site settings, theme customization
- **Image pipeline** — auto WebP + AVIF on upload, content negotiation, Unsplash srcSet
- **UI extras** — hero slider, service slider, category carousel, notification marquee, ad slots, code-split lazy routes

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB 6+ running on `localhost:27017`
- npm or yarn

### Setup

```bash
# 1. Clone & install dependencies
cd astro-client && npm install
cd ../server && npm install

# 2. Configure environment
cp server/.env.example server/.env   # edit MONGODB_URI, JWT_SECRET, etc.
cp astro-client/.env.example astro-client/.env   # set API_URL, SITE_URL, BACKEND_URL

# 3. Start backend (port 5000)
cd server && npm run dev

# 4. Start frontend  (port 4321)
cd astro-client && npm run dev

# 5. Seed demo data (optional)
cd server && npm run seed
```

Open http://localhost:4321

### Default Admin

- **Email:** `admin@example.com`
- **Password:** `Admin@123`

## Environment Variables

### `server/.env`

| Variable | Default | Description |
|---|---|---|
| `MONGODB_URI` | `mongodb://localhost:27017/bloghub` | MongoDB connection string |
| `JWT_SECRET` | `your-secret-key-change-in-production` | JWT signing secret |
| `JWT_EXPIRE` | `7d` | Token expiry |
| `PORT` | `5000` | Express port |
| `NODE_ENV` | `development` | Enables/disables rate limiting + security headers |
| `SITE_URL` | `http://localhost:5000` | Used for CORS and canonical fallback |

### `astro-client/.env`

| Variable | Default | Description |
|---|---|---|
| `API_URL` | `http://localhost:5000` | Backend origin |
| `SITE_URL` | `http://localhost:4321` | Used in SSR canonical/hreflang generation |
| `BACKEND_URL` | `http://localhost:5000` | Middleware proxy target |

## Project Structure

```
├── astro-client/          # Astro 5 SSR + React 18 SPA
│   ├── src/
│   │   ├── components/    # React components (Admin, Footer, Header, BlogDetail, etc.)
│   │   ├── layouts/       # MainLayout.astro (meta, JSON-LD, theme script)
│   │   ├── pages/         # Astro routes (index, blog/[slug], service/[slug], [...path])
│   │   ├── stores/        # DataContext, ThemeContext, LanguageContext
│   │   └── lib/           # API client, slug utils, theme presets, chatbot context
│   ├── astro.config.mjs
│   └── package.json
│
├── server/                # Express 4 REST API
│   ├── models/            # Mongoose schemas (Blog, Service, User, WebsiteSetting, etc.)
│   ├── routes/            # Express routers (blogs, services, auth, users, upload, etc.)
│   ├── middleware/         # Auth (protect/adminOnly), security headers, webp content-negotiation
│   ├── server.js          # Entry point
│   ├── seed.js            # Demo data seeder
│   └── package.json
│
├── FULL_PROJECT_REPORT.txt  # Comprehensive technical analysis
├── AGENTS.md                # Development session log
└── .gitignore
```

## Production Deployment

1. **Build frontend:** `cd astro-client && npm run build`
2. **Set production env:** `NODE_ENV=production` in server/.env
3. **Run both services** behind a reverse proxy (nginx, Caddy, or PM2):
   - Map `/api/*` and `/uploads/*` to Express at `localhost:5000`
   - Map everything else to Astro at `localhost:4321`
4. **Security note:** Change the default admin password and JWT_SECRET before going live.

## License

<!-- Add your chosen license here, or remove this section if none -->
