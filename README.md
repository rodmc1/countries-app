# Countries App

A countries search app built with React, TanStack Query, Tailwind CSS, and shadcn/ui (base-ui). Search countries by name and view details (flag, coat of arms, currency, driving side) sourced from the [REST Countries API](https://restcountries.com/). On first load, the app uses IP-based geolocation to display the user's own country.

## Features

- Type-ahead search with 500 ms debounce and a virtualised result list
- Clear (✕) button with tooltip to reset the search input
- Selected country pinned in the dropdown so re-opening shows the choice
- IP-based geolocation seeds the initial country (with a backup provider if the primary fails)
- Detail panel shows flag, coat of arms, currency, and driving side
- Error boundary + retry for failed lookups

## Tech Stack

- **React 19** + **TypeScript** + **Vite**
- **TanStack Query v5** — data fetching, caching, retries
- **Tailwind CSS v4** + **shadcn/ui** (base-ui + radix-ui) — styling and primitives
- **@tanstack/react-virtual** — virtualised search results list
- **react-error-boundary** — error boundaries for the detail panel
- **axios** + **use-debounce** — HTTP client and debounced input

## External APIs

| API                                           | Purpose                                 |
| --------------------------------------------- | --------------------------------------- |
| `restcountries.com/v3.1/name/{name}`          | Search countries by name                |
| `restcountries.com/v3.1/name/{name}?fullText` | Fetch full details for a single country |
| `restcountries.com/v3.1/alpha/{code}`         | Look up a country by ISO alpha code     |
| `ipapi.co/json/`                              | Primary IP geolocation                  |
| `get.geojs.io/v1/ip/country.json`             | Backup IP geolocation                   |

## Prerequisites

- **Node.js** ≥ 20
- **npm** ≥ 10 (or your preferred package manager)

## Getting Started

Install dependencies:

```bash
npm install
```

Start the dev server (Vite, with HMR):

```bash
npm run dev
```

Then open the URL shown in the terminal (typically <http://localhost:5173>).

## Available Scripts

| Script            | Purpose                                  |
| ----------------- | ---------------------------------------- |
| `npm run dev`     | Start the Vite dev server with HMR       |
| `npm run build`   | Type-check (`tsc -b`) and build for prod |
| `npm run preview` | Preview the production build locally     |
| `npm run lint`    | Run ESLint across the project            |

## Project Structure

```
src/
  api/              REST Countries + geolocation API clients
  components/
    country/        SearchInput, CountryDetail, CountryExplorer
    shared/         DataBoundary, ErrorView, LoadingSkeleton
    ui/             shadcn/ui primitives (combobox, tooltip, etc.)
  hooks/            useCountrySearch, useCountrySearchByFullName, useUserCountry
  pages/            HomePage
  types/            Country type
  App.tsx, main.tsx
```

## Architecture Notes

- **Search flow** — `CountryExplorer` owns the query/selection state. `SearchInput` is a controlled combobox built on base-ui that filters synthetic input events from the underlying primitive.
- **Initial country** — `useUserCountry` chains an IP lookup with a country lookup. `displayedCountry` is derived as `pinnedCountry ?? userCountry`, avoiding `useEffect` for state syncing.
- **No re-fetch on first render** — the geolocated country is fetched via the `/alpha/{code}` endpoint with all detail fields, so the detail panel can render it directly without an additional `fullText` request.
- **Pagination** — REST Countries doesn't support pagination, so the result list is virtualised with `@tanstack/react-virtual` to stay performant on large result sets.
- **Debounce** — search input is debounced 500 ms to avoid hitting the API on every keystroke.
- **Geolocation fallback** — if `ipapi.co` fails (rate limit, ad blocker), the request transparently retries against `get.geojs.io`.
