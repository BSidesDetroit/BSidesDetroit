# BSides Detroit Website

Static Astro site for BSides Detroit. It is designed so most organizers only edit plain Markdown files in `content/`.

## Edit Website Copy

Most updates happen here:

```text
content/
  home.md
  about.md
  past.md
  code-of-conduct.md
  discord.md
  site.md
  sponsor.md
```

The `src/` folder controls layout and styling. Most team members should not need to edit it.

Page titles are already set by the Astro page templates. Content files should usually start with body copy or a `## Section title`, not a top-level `# Page title`, otherwise the published page will show duplicate headings.

## Edit In GitHub

Use this when you only need to change text.

1. Open the GitHub repository in your browser.
2. Open the `content/` folder.
3. Open the Markdown file for the page you want to update.
4. Click the pencil icon to edit.
5. Change the text.
6. Click **Commit changes**.
7. GitHub Actions will rebuild and publish the site.

Markdown basics:

```md
# Big page title

## Section title

Normal paragraph text.

- Bullet item
- Another bullet item

[Link text](https://example.com)
```

## Run Locally With Docker

Docker is the preferred local workflow. You do not need Node.js installed on your laptop for this path.

Production-like static build and preview:

```bash
docker compose up --build
```

If Docker reports that `npm ci` cannot find `@emnapi/core` or
`@emnapi/runtime` in the lockfile, regenerate the lockfile in the same Linux
Node 26 environment used by the image, then rebuild without cached layers:

```bash
docker run --rm \
  -v "$PWD:/app" \
  -w /app \
  node:26-bookworm-slim \
  npm install --package-lock-only --ignore-scripts --no-audit

docker compose build --no-cache
docker compose up
```

Open `http://localhost:4321`.

Stop it:

```bash
docker compose down
```

Development mode with live reload:

```bash
docker compose --profile dev up dev
```

This runs `npm ci` and `npm run dev` inside the Node 26 container, not on your host machine.

The Docker image uses a multi-stage build:

1. Build stage installs locked dependencies and runs `npm run build`.
2. Runtime stage uses unprivileged nginx to serve the generated `dist/` folder.

The runtime container does not use secrets, databases, server-side app code, Node.js, or npm.

Snyk CLI `1.1301.0` tested `bsides-detroit-site:local` with `--severity-threshold=high` after the nginx runtime update and reported no vulnerable paths found. Re-run the scan with:

```bash
snyk container test bsides-detroit-site:local --severity-threshold=high --file=Dockerfile
```

## Run Locally With npm

This is optional for people who already have Node.js 26 installed.

```bash
npm install
npm run dev
```

Open `http://localhost:4321`.

Build the static site:

```bash
npm run build
```

Run static smoke checks against the built `dist/` folder:

```bash
npm test
```

Preview the built site:

```bash
npm run preview
```

Run smoke checks against a running local server:

```bash
npm run smoke
```

Run the production Docker image and verify key page text over HTTP:

```bash
npm run smoke:docker
```

The Docker smoke test uses host port `4322` by default so it does not collide with a normal `docker compose up` preview on `4321`.

## GitHub Pages

The site is configured for the future custom domain:

```text
https://www.bsidesdetroit.org
```

If the site needs to live temporarily at a GitHub Pages project URL such as:

```text
https://ORG.github.io/REPO/
```

then add this to `astro.config.mjs`:

```js
base: "/REPO",
```

Remove that `base` setting when the custom domain is active.
