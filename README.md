# Hilton’s Books — Mission 12

Bookstore app with a React storefront, .NET API, and SQLite database. Source lives under [`Mission11/`](Mission11/).

---

## Live site (deployed)

**Storefront:** [https://lively-pond-0a0752010.7.azurestaticapps.net](https://lively-pond-0a0752010.7.azurestaticapps.net)

To **add, edit, or delete books** in the database, open the live site and click **Manage books** in the top bar. That opens the admin page (`/adminbooks`) where you can maintain the catalog.

If your Azure URLs change, update the frontend API base in `Mission11/frontend/src/api/BooksAPI.ts` (or set `VITE_BOOK_API_URL` in the Static Web App build configuration).

---

## Run on your machine (`main` branch)

1. **Clone and use `main`**

   ```bash
   git clone https://github.com/Paris-Jane/Mission12.git
   cd Mission12
   git checkout main
   ```

2. **API (.NET 8)**

   ```bash
   cd Mission11/backend/Mission11.API
   dotnet restore
   dotnet run
   ```

   By default the API listens on **http://localhost:4040** and **https://localhost:5050** (see `Properties/launchSettings.json`).

3. **Frontend (Vite + React)**

   ```bash
   cd Mission11/frontend
   npm install
   ```

   Point the app at your local API (create this file if needed):

   ```bash
   # Mission11/frontend/.env.local
   VITE_BOOK_API_URL=http://localhost:4040/api/Book
   ```

   Then start the dev server:

   ```bash
   npm run dev
   ```

   Open the URL Vite prints (often `http://localhost:5173` or `http://localhost:3030`). Use **Manage books** in the nav the same way as on the deployed site.

---

## Repository layout

| Path | What it is |
|------|------------|
| `Mission11/backend/Mission11.API` | ASP.NET Core Web API + EF Core + SQLite |
| `Mission11/frontend` | Vite + React + TypeScript UI |
