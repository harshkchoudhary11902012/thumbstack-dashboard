# Personal Book Manager

A minimal full-stack app to manage your reading list: sign up, log in, and track books with status (Want to read / Reading / Completed) and tags.

**Live demo:** [Add your Vercel link here]

---

## What's in the repo

| Area         | Stack                                                         |
| ------------ | ------------------------------------------------------------- |
| **Frontend** | Next.js 16 (App Router), React 19, Tailwind CSS, Tabler Icons |
| **Backend**  | Express, TypeScript                                           |
| **Auth**     | JWT (Bearer token, 7-day expiry)                              |
| **Database** | MongoDB (Mongoose)                                            |

- **Auth flow:** Sign up → Log in (JWT stored in `localStorage`) → Protected dashboard.
- **Books:** CRUD with title, author, tags (categories), and status. Filter by tag/status; edit/delete via modal and confirmation dialog.
- **UI:** Centered card for login/signup; dashboard with collapsible sidebar, header (breadcrumbs + user menu), and books table.

---

## Local setup

### 1. Clone and install

```bash
git clone <your-repo-url>
cd thumbstack-dashboard

# Backend
cd server && npm install && cd ..

# Frontend
cd client && npm install && cd ..
```

### 2. Environment variables

Copy the root `.env.example` and set values:

- **Server** (e.g. `server/.env`): `MONGODB_URI`, `JWT_SECRET`, optional `PORT`.
- **Client** (e.g. `client/.env.local`): `NEXT_PUBLIC_API_URL` pointing at your API (local or deployed).

See [.env.example](.env.example) for variable names and examples.

### 3. Run locally

**Terminal 1 – API (port 4000):**

```bash
cd server && npm run dev
```

**Terminal 2 – Next.js (port 3000):**

```bash
cd client && npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Use **Sign up** to create an account, then **Log in** and add books from the dashboard.

---

## Project structure

```
thumbstack-dashboard/
├── .env.example          # Env vars for local setup (copy to server/.env and client/.env.local)
├── README.md
├── client/               # Next.js frontend
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx      # Login (home)
│   │   ├── login/        # Redirects to / or /dashboard
│   │   ├── signup/
│   │   └── dashboard/    # Books listing + layout (sidebar, header)
│   ├── components/       # Layouts, Header, Sidebar, Modals
│   └── lib/api.ts        # getToken(), api()
└── server/               # Express API
    ├── src/
    │   ├── index.ts      # Routes, auth middleware
    │   └── models/       # User, Book (Mongoose)
    └── .env.example      # Server env template
```

---

## Deployment (Vercel + MongoDB Atlas)

### Database

1. Create a cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Get the connection string and set it as `MONGODB_URI` where the API runs.

### Backend (API)

Deploy the Express server to **Railway**, **Render**, or similar. Set:

- `MONGODB_URI` = Atlas connection string
- `JWT_SECRET` = strong random secret
- `PORT` = provided by the host (often automatic)

Note the public API URL (e.g. `https://your-api.railway.app`).

### Frontend (Vercel)

1. Import the repo in [Vercel](https://vercel.com) and set the **root directory** to `client`.
2. In **Settings → Environment variables**, add:
   - `NEXT_PUBLIC_API_URL` = your deployed API URL (e.g. `https://your-api.railway.app`)
3. Deploy. Vercel will build and serve the Next.js app.

After deployment, open the Vercel URL and confirm sign up, login, and book CRUD work against the deployed API and MongoDB Atlas.

---

## Scripts

| Where     | Command         | Purpose                             |
| --------- | --------------- | ----------------------------------- |
| `server/` | `npm run dev`   | Run API with hot reload (port 4000) |
| `server/` | `npm run build` | Compile TypeScript to `dist/`       |
| `server/` | `npm start`     | Run compiled API                    |
| `client/` | `npm run dev`   | Run Next.js dev server (port 3000)  |
| `client/` | `npm run build` | Production build                    |
| `client/` | `npm start`     | Run production Next.js              |

---

## License

MIT.

Use your own MongoDB Atlas cluster (free tier) and a strong JWT_SECRET; no need for the author’s credentials.
