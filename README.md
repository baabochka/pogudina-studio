# Pogudina Studio

Personal portfolio site for Valentina Pogudina, built with Vite, React, TypeScript, Tailwind CSS, and React Router.

Production URL:
`https://baabochka.github.io/pogudina-studio/`

## Stack

- Vite
- React
- TypeScript
- Tailwind CSS v4
- React Router
- GitHub Pages via GitHub Actions

## Local development

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Run ESLint:

```bash
npm run lint
```

Preview the production build locally:

```bash
npm run preview
```

## GitHub Pages deployment

This repo is configured for GitHub Pages project-site hosting at:

`https://baabochka.github.io/pogudina-studio/`

Deployment is handled by the workflow in
[.github/workflows/deploy.yml](/Users/baabochka/Workplace/pogudina_website/.github/workflows/deploy.yml).

Important setup details:

- Vite `base` is set to `/pogudina-studio/`
- React Router uses `basename: import.meta.env.BASE_URL`
- `public/404.html` provides SPA fallback support for `BrowserRouter`

## How to update the live site

Any push to `main` triggers a new GitHub Pages deployment.

Typical update flow:

```bash
git status
git add .
git commit -m "Update portfolio content"
git push
```

Then:

1. Open the GitHub repository.
2. Go to the `Actions` tab.
3. Wait for the deploy workflow to finish.
4. Refresh the live site.

If the site does not update immediately, wait a minute or two and hard refresh the browser.

## Useful git commands

Check current changes:

```bash
git status
```

See changed files:

```bash
git diff
```

Stage everything:

```bash
git add .
```

Stage one file:

```bash
git add src/pages/AboutPage.tsx
```

Create a commit:

```bash
git commit -m "Update about page"
```

Push changes:

```bash
git push
```

Pull remote changes with rebase:

```bash
git pull --rebase origin main
```

Fetch remote changes without modifying local files:

```bash
git fetch origin
```

See recent commit history:

```bash
git log --oneline --decorate -n 10
```

## If a push is rejected

If GitHub says the remote contains work you do not have locally:

```bash
git pull --rebase origin main
git push
```

If there is a conflict:

1. Edit the conflicted file.
2. Save the resolved version.
3. Stage it with `git add <file>`.
4. Continue with:

```bash
git rebase --continue
```

## Repository structure

```text
src/
  components/
    layout/
    ui/
  context/
  data/
  pages/
  App.tsx
  index.css
  main.tsx
  router.tsx
public/
  404.html
.github/workflows/
  deploy.yml
```
