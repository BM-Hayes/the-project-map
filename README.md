# The Project Map

**Domain:** theprojectmap.com

Map-first public filings tracker for large energy and water-touching projects.
Not a news site. Not a campaign. Not Weekend Atlas.

Stack: Next.js (App Router, TypeScript) · Mapbox GL · Supabase · Vercel.
Separate GitHub repo, Vercel project (`the-project-map`), and Supabase project
from `weekend-atlas`.

## What this is

Open the map. See solar farms, data centers, large-load sites, and water/PFAS context.
Tap a site. See stage, next public date, and links to official filings.

Default geography: Darlington County, South Carolina. County is a filter, not the brand.

## Routes

- `/` — map (home; holding page until the map path is live)
- `/site/[slug]` — project dossier
- `/week` — next 14 days, text/printable
- `/suggest` — anonymous tip into `review_queue`
- `/about` — scope, sources, what this is not

## Locked product rules

- Map is the home page.
- Anonymous pin in localStorage. No account in v1.
- Tracker tone. No petitions, donate, or campaign chrome.
- Default filter: Darlington County, SC.
- Badges: official | verified | community | unverified.
- `/suggest` writes `review_queue` only. No auto-promote to published sites.
- Official source URL required before a site is published.

## Status

- Domain reserved: theprojectmap.com (do not attach until holding page is live)
- Vercel project: `the-project-map` (team hayes-clan)
- App: Next.js holding page + route stubs

## Sister-site rule

Zero shared header, footer, domain, copy, or data tables with Weekend Atlas.
Same human, same general stack, different product.
