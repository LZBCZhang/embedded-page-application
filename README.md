# Embedded Page Application

ASP.NET Core MVC host serving a React (Vite + TypeScript) single-page app for
embeddable consent / preference-management pages. Structured like the standard
Visual Studio "React and ASP.NET Core" template: two projects in one solution.

```
.
├── EmbeddedPageApplication.sln
├── EmbeddedPageApplication.Server/          # ASP.NET Core MVC host
│   ├── EmbeddedPageApplication.Server.csproj #   refs the client + SpaProxy
│   ├── Program.cs                            #   hosting, CORS, SPA fallback
│   ├── Controllers/                          #   API + MVC controllers
│   │   ├── ConsentController.cs              #     POST /api/consent/*
│   │   ├── UnsubscribeController.cs          #     POST /api/public/unsubscribe
│   │   └── HomeController.cs
│   ├── Models/                               #   C# DTOs mirroring the TS types
│   ├── Services/                             #   PreferencesService (in-memory stub)
│   └── Properties/launchSettings.json
└── embeddedpageapplication.client/          # React SPA (Vite)
    ├── embeddedpageapplication.client.esproj #   JS project (shows in the solution)
    └── src/ …                                #   see its README.md
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

Replace `EmbeddedPageApplication.Server/Services/PreferencesService.cs` with a
real data store / downstream consent service for production.

## Running in development

Start the **server** — `Microsoft.AspNetCore.SpaProxy` auto-launches the Vite
dev server (`npm run dev`) and opens the browser to it:

```bash
cd embeddedpageapplication.client && npm install   # first time only
cd ../EmbeddedPageApplication.Server && dotnet run  # https://localhost:5001
```

The browser opens at **http://localhost:5173** (Vite, with HMR). Vite proxies
`/api/*` to the server at `https://localhost:5001` — already configured in
`embeddedpageapplication.client/.env.local`
(`VITE_API_BASE_URL=https://localhost:5001`, `VITE_MOCK_ENABLED=false`).

To use the in-browser MSW mocks instead of the real C# backend, remove/disable
that `.env.local`.

You can also run the two projects independently (`dotnet run` in one terminal,
`npm run dev` in the other) — same result.

## Building / publishing for production

`dotnet publish` builds the referenced `.esproj` (runs `npm run build`) and the
Vite output is placed in the server's `wwwroot`. The server then serves the
built SPA and falls back to `index.html` for client-side routes.

```bash
cd EmbeddedPageApplication.Server
dotnet publish -c Release -o ./publish
./publish/EmbeddedPageApplication.Server
```

## Frontend

See [`embeddedpageapplication.client/README.md`](embeddedpageapplication.client/README.md)
for the React app (tests, i18n, embed-token handling, etc.).