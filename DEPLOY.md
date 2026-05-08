DEPLOY GUIDE
============

This repo includes a GitHub Actions workflow that builds the project on push to `main`. Optionally the workflow can deploy to Vercel if you set a `VERCEL_TOKEN` secret in your repository settings.

What the workflow does
- On push/pull_request to `main` it installs deps, runs `npx tsc --noEmit` and `npm run build`.
- If `VERCEL_TOKEN` exists and the push is to `main`, the workflow runs `npx vercel --prod` to deploy.

Required secrets (do NOT commit these to the repo)
- `VERCEL_TOKEN` — personal token from Vercel (only if you want automatic deploy). Add at: Settings → Secrets & variables → Actions.
- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` — required by the app at runtime if you use Supabase. Set these as repository secrets or in Vercel environment variables when deploying.

Security note — leaked keys
--------------------------------
You pasted a key in chat. DO NOT paste secrets in public chat or commit them to the repo. Treat the pasted key as compromised and rotate it immediately at its provider console.

Steps to rotate (summary)
1. Go to the service provider (Vercel / Supabase / other) where the key was created.
2. Revoke/delete the exposed key.
3. Create a new token with the minimum required scope.
4. Update GitHub Secrets and/or Vercel environment variables with the new token.

How to enable automatic deploy (quick)
1. Create a Vercel token (Vercel Settings → Tokens → Create Token).
2. In your GitHub repo, go to Settings → Secrets & variables → Actions → New repository secret, and set `VERCEL_TOKEN` to the token value.
3. Push to `main`. The workflow will run and, if all checks pass, will call `npx vercel --prod` to deploy.

Manual deploy
- You can still deploy manually from your machine with the Vercel CLI:

```powershell
npx vercel --prod --token "$env:VERCEL_TOKEN"
```

Notes
- The CI job requires Node 18 and uses `npm ci` to install dependencies.
- If your project requires additional secrets (Supabase, DB, etc.), set them as GitHub Secrets or in your Vercel project environment.

If you want, I can also:
- Add `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` as optional secret-checks in the workflow so the deploy step is fully non-interactive.
- Wire up a GitHub Pages or other provider deploy step instead of Vercel.
Automatic deploys (CI) and Supabase env handling

What I changed
- `lib/supabase.ts` now avoids creating a Supabase client at import time when
  the public env variables are not provided. This prevents the app from
  crashing locally with `supabaseUrl is required.`
- Added a GitHub Actions workflow `.github/workflows/ci-deploy.yml` that will
  build the project on every push to `main`. If you add a `VERCEL_TOKEN` and
  `VERCEL_PROJECT_ID` as GitHub Secrets, the workflow will also run the Vercel
  CLI to deploy the app.

How to configure for automatic deploy
1. Push these changes to your GitHub repository's `main` branch.
2. (Recommended) Connect the repo to Vercel via the Vercel dashboard for
   automatic deployments on push. This often is easier than using the CLI in
   CI because Vercel will automatically handle project settings and environment
   variables.

Or: Use the provided GitHub Actions deploy step
- Create these GitHub Secrets in your repo Settings > Secrets:
  - `VERCEL_TOKEN` (get from Vercel account -> Settings -> Tokens)

Optional / recommended environment variables used by the app
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY

Notes
- The workflow will run `npm run build`. Make sure your `package.json` has a
  valid `build` script (Next.js projects normally have `next build`).
- If you prefer Netlify or another host, let me know and I can add a workflow
  for that provider instead.
