# Embedded Page Application

ASP.NET Core MVC host serving a React (Vite + TypeScript) single-page app for
embeddable consent / preference-management pages.

```
.
├── EmbeddedPageApplication.sln
├── EmbeddedPageApplication.Server.csproj   # ASP.NET Core MVC host
├── Program.cs                              # hosting, CORS, SPA proxy/fallback
├── Controllers/                            # API + MVC controllers
│   ├── ConsentController.cs                #   POST /api/consent/*
│   ├── UnsubscribeController.cs            #   POST /api/public/unsubscribe
│   └── HomeController.cs
├── Models/                                 # C# DTOs mirroring the TS types
├── Services/                               # PreferencesService (in-memory stub)
├── Properties/launchSettings.json
└── ClientApp/                              # React SPA (Vite) — see ClientApp/README.md
```

## Prerequisites

- [.NET SDK 8.0+](https://dotnet.microsoft.com/download)
- Node.js 20+ / npm

> The .NET SDK is **not** installed in the environment these files were
> scaffolded in, so the server side has not been built or run here. Install the
> SDK, then verify with the steps below.

## API surface

The C# controllers implement the same endpoints the React app already calls,
returning in-memory stub data (seeded identically to the former MSW mocks):

| Method | Route                              | Purpose                          |
| ------ | ---------------------------------- | -------------------------------- |
| POST   | `/api/consent/user-consents`       | Fetch a user's purposes/consents |
| POST   | `/api/consent/update-user-consents`| Persist preference changes       |
| POST   | `/api/public/unsubscribe`          | One-click unsubscribe            |

Replace `Services/PreferencesService.cs` with a real data store / downstream
consent service for production.

## Running in development

Two dev workflows are supported.

### A. Unified (recommended)

The server proxies all non-API requests to the Vite dev server.

```bash
# terminal 1 — React dev server on http://localhost:5173
cd ClientApp && npm install && npm run dev

# terminal 2 — ASP.NET Core host on https://localhost:5001
dotnet run
```

Open **https://localhost:5001/preferences** (or `/unsubscribe`). API calls hit
the C# controllers same-origin; everything else is proxied to Vite with HMR.

### B. Vite-only with API proxy

Run just the SPA and let Vite forward `/api` to the server (already configured
in `ClientApp/.env.local` → `VITE_API_BASE_URL=https://localhost:5001`):

```bash
dotnet run                       # server on :5001
cd ClientApp && npm run dev      # SPA on :5173, proxies /api -> :5001
```

Open http://localhost:5173. To use the in-browser MSW mocks instead of the
real server, remove/disable `ClientApp/.env.local` (it sets
`VITE_MOCK_ENABLED=false`).

## Building / publishing for production

`dotnet publish` runs `npm install && npm run build` in `ClientApp/` and copies
the Vite output into `wwwroot/`. The server then serves the built SPA and falls
back to `index.html` for client-side routes.

```bash
dotnet publish -c Release -o ./publish
./publish/EmbeddedPageApplication.Server
```

## Frontend

See [`ClientApp/README.md`](ClientApp/README.md) for the React app (tests,
i18n, embed-token handling, etc.).