# Push to GitHub & Deploy on Vercel

Your repo is initialized and the first commit is done. Follow these steps.

---

## 1. Create the repo on GitHub

1. Go to [github.com/new](https://github.com/new).
2. **Repository name:** e.g. `thumbstack-dashboard` (or any name you like).
3. **Public**, leave **README**, **.gitignore**, and **License** unchecked (you already have these in your project).
4. Click **Create repository**.

---

## 2. Push your code to GitHub

On your machine, in the project folder, run (replace `YOUR_USERNAME` and `YOUR_REPO` with your GitHub username and repo name):

```bash
cd /Users/harsh/PersonalProjects/thumbstack-dashboard

git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

If you use SSH:

```bash
git remote add origin git@github.com:YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

Enter your GitHub credentials or use a personal access token if prompted.

---

## 3. Deploy the frontend on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in (with GitHub).
2. Click **Add New…** → **Project**.
3. **Import** your GitHub repo (`YOUR_USERNAME/YOUR_REPO`).
4. **Root Directory:** set to **`client`** (so Vercel builds the Next.js app).
5. **Environment variables:** add:
   - **Name:** `NEXT_PUBLIC_API_URL`  
   - **Value:** For now use `http://localhost:4000` if you only want to test the deploy.  
     When your API is deployed (e.g. Railway/Render), set this to your API URL (e.g. `https://your-api.railway.app`).
6. Click **Deploy**.

After the build finishes, Vercel will give you a URL (e.g. `https://your-project.vercel.app`). Open it to see the app.

**Note:** The app will only work end-to-end in production once the **backend is also deployed** and `NEXT_PUBLIC_API_URL` points to that API. Until then, the Vercel site will load but login/signup and books will fail unless you run the API locally and use a tunnel, or deploy the API first and then set `NEXT_PUBLIC_API_URL` to the deployed API URL.

---

## 4. (Optional) Deploy the API

To have a fully working live app:

1. Deploy the **server** to [Railway](https://railway.app), [Render](https://render.com), or similar.
2. Set env vars there: `MONGODB_URI`, `JWT_SECRET`, and `PORT` (if required).
3. Copy the public API URL from the host.
4. In **Vercel** → your project → **Settings** → **Environment Variables**, set `NEXT_PUBLIC_API_URL` to that API URL and redeploy.

Then update your main **README.md** “Live demo” link with your Vercel URL.
