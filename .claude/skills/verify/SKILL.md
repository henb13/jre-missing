---
name: verify
description: Build, launch, and drive jre-missing (React client + Express API) to verify changes end-to-end.
---

# Verifying jre-missing

## Launch (no database needed)

The server has a built-in mock API (`server/api/dev-api.js` serving
`server/api/__mocks__/mockResponse.json`) — no Postgres required:

```bash
cd server && USE_MOCK_DATA=true NODE_ENV=development node app.js   # API on :3001
cd client && npx vite --port 3000 --strictPort                     # client on :3000
```

`client/.env.development.local` already points `VITE_API_BASE_URL` at
`http://localhost:3001`. Probe readiness: `curl localhost:3001/api/episodes`.

## Drive

Playwright with system Chrome works (no browser download):
`chromium.launch({ channel: "chrome", headless: true })`. Install
`playwright` in the scratchpad, not the repo.

Flows worth driving: initial skeleton → list render; tab switch
(Removed/Shortened); search box + sort disclosure interplay; change-history
disclosure on shortened episodes; tag tooltip; scroll button (only enabled
when page is scrollable); AmountInfo stat buttons.

## Gotchas

- The mock fixture has only **1 shortened episode with 1 change and no
  tags** — change-history expansion, "new"/"original length" tags, and the
  tooltip never render with it. Enrich the response via Playwright
  `page.route("**/api/episodes", ...)` to exercise those paths.
- A `403` console error from `pagead2.googlesyndication.com` on localhost is
  pre-existing AdSense noise, not an app bug.
- The scroll button uses `window.scroll({ behavior: "smooth" })` — wait with
  `waitForFunction` on `window.scrollY`, not a fixed timeout.
- react-tooltip v5 renders `#tag-tooltip` lazily; assert visibility after
  hover, not DOM presence at load.
