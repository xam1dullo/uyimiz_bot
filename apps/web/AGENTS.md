# @uyimiz/web — Public Website Agent Instructions

> Astro + Tailwind CSS. Static site with SSG.
> Pages: Landing, Features, Pricing, Docs, Blog.

---

## Stack
- Astro v5 (static site generation)
- Tailwind CSS (styling)
- @uyimiz/shared (types only, no framework deps)

## Rules
- NO React components unless truly needed (use Astro components)
- Islands architecture: interactive parts → React islands
- All pages statically generated (`output: 'static'`)
- Images: WebP format, lazy loading, explicit width/height
- SEO: every page has title, description, og:image meta
- Performance: Lighthouse score > 90 on all metrics

## Content
- All content in `src/content/` (Astro content collections)
- Blog posts: MDX format
- Supported languages: uz, ru, en (i18n routing: `/uz/`, `/ru/`, `/en/`)
- Default lang: uz

## DO NOT
- ❌ No server-side API routes (static only)
- ❌ No heavy JavaScript bundles
- ❌ No inline styles
