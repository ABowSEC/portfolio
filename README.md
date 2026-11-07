# abowsec — Andrew Bowman's portfolio

Single-page portfolio covering my projects (Ephemeris, NetSleuth and work in progress), an about section, an FAQ and contact links.

Built with **Next.js 16** (App Router), **React 19**, **TypeScript** and CSS Modules. No UI framework. It's exported as a fully static site, so it can be hosted anywhere that serves files.

## Run it

```bash
npm install
npm run dev     # http://localhost:3000
npm run lint
npm run build   # static export to out/
npx serve out   # preview the exported site
```

## Editing content

Most changes are data edits. You shouldn't need to touch the components.

| What | Where |
| --- | --- |
| Name, GitHub, email, LinkedIn, résumé link | `src/data/site.ts` (an empty field hides its button) |
| School, photo, story, "Now" list, timeline, interests | `src/data/me.ts` (empty fields are hidden) |
| Projects: summary, highlight, stack, links, status | `src/data/projects.ts` |
| FAQ entries | `src/data/faq.ts` |
| Project screenshots | `public/img/` (set `image: "/img/<file>.png"` on the project) |
| Résumé PDF | `public/resume.pdf`, then set `resume: "/resume.pdf"` in `site.ts` |

Project `status` controls placement: `live` and `featured` get a large card with media, and `wip` goes under "In the works."

## Interactive bits

- **Terminal**: press <kbd>`</kbd> or click `>_` in the nav. Commands are in `src/components/Terminal.tsx` (`help`, `ls`, `cat`, `open`, `cd`, `ping`, plus a few hidden ones). It reads its data from `src/data/`.
- **Protocol inspector**: on the CodeBreaker card, a playable game that shows every frame of the real wire protocol (4-byte big-endian length + UTF-8 JSON) as hex. The protocol logic is in `src/lib/codebreaker.ts`. Enable it on any project with `demo: "protocol-inspector"`.
- **Trace rail**: on screens ≥1280px, a traceroute down the left edge. Each section is a hop, and each hop shows when you first reached it. Section tracking is shared with the nav via `src/lib/useSectionProgress.ts`.

## Personalization

- **Greeting** (hero): the visitor's local time next to yours, a "welcome back" that remembers which project they last looked at (and whether it has new commits since), and a hello for visitors arriving from LinkedIn or GitHub. All of it is stored in the visitor's own browser (`src/lib/visit.ts`).
- **Live activity**: recent commits from each project's `repo` show in the Now section, and each card shows when it was last updated. The commits are fetched at build time, so they're in the HTML, then refreshed in the browser at most every 15 minutes (`src/lib/activity-store.ts`). If GitHub is unreachable, the build-time copy stays. Set `GITHUB_TOKEN` when building to raise GitHub's 60 requests/hour limit.

## Structure

```
src/app/         layout (fonts, metadata, nav/footer), page, global styles
src/components/  one component + CSS module per section
src/data/        site info, projects, FAQ
public/img/      screenshots
```

## Hosting (Cloudflare Pages)

The site is a static export (`output: "export"` in `next.config.ts`), so `npm run build` writes everything to `out/`.

1. Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git** → choose this repo.
2. Build settings: preset **Next.js (Static HTML Export)**, build command `npm run build`, output directory `out`. Leave the root directory blank.
3. Environment variables:
   - `NODE_VERSION` = `22`
   - `GITHUB_TOKEN` = a fine-grained token with public-repo read access. It keeps the build-time commit feed from hitting GitHub's shared-IP rate limit.
4. Every push to `main` redeploys.

The deployed address lives in one place: `url` in `src/data/site.ts`. It feeds link previews (Open Graph and Twitter), the canonical URL, `sitemap.xml` and `robots.txt`. When you add a custom domain, change that line and push.

The social preview image is `src/app/opengraph-image.png` (1200×630), with alt text in `opengraph-image.alt.txt`.
