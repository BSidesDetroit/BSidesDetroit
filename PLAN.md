# BSides Detroit Astro Holding Site Plan

## Summary

Build a static Astro site for BSides Detroit with BSides JAX-inspired terminal/transmission styling and very simple Markdown editing. The site deploys to GitHub Pages, runs locally with npm or Docker, and keeps team-editable content in the top-level `content/` folder.

Use root-relative routes now for the future `www.bsidesdetroit.org` domain. If temporary GitHub Pages project-path hosting is needed, document the Astro `base` setting change.

## Style Direction

- Use BSides JAX as the primary flavor reference: boot/uplink intro text, shell prompt navigation, command-style CTAs, bracketed sector labels, terminal panels, stat strips, mission-brief blocks, and footer commands.
- Adapt the language to Detroit instead of copying JAX text.
- Use the provided BSides Detroit logo as the main brand visual.
- Theme colors: black base, BSides yellow primary, cyan/Detroit blue accent.

## Implementation

- Create routes for `/`, `/about`, `/past`, `/code-of-conduct`, `/hello`, and `/sponsor`.
- Keep editable copy in `content/home.md`, `content/about.md`, `content/past.md`, `content/code-of-conduct.md`, `content/hello.md`, `content/sponsor.md`, and `content/todo.md`.
- Keep Markdown plain: headings, paragraphs, links, and lists. No MDX or embedded components for v1.
- Use Astro layouts and components to turn simple Markdown into styled site chrome.
- Include placeholder copy for now, including lorem ipsum for code of conduct.
- Track future TODOs for CFP redirect, volunteer redirect, tickets, and free/sponsored tickets for students, volunteers, and veterans.

## Build, Deploy, And Security

- Use the latest stable major release for core tooling.
- Interpret `n-1` as minor/patch conservatism, not staying behind on major versions.
- Use Node.js 26 as the current major and pin app dependencies through `package-lock.json`.
- Keep dependencies minimal and add Dependabot for npm and GitHub Actions.
- Add Docker local static testing.
- Add GitHub Actions to build Astro and deploy `dist/` to GitHub Pages.
- Keep the site fully static: no server APIs, database, CMS, backend forms, or runtime secrets.

## Editing Workflow

- Browser-based GitHub editing: open `content/`, edit a Markdown file, commit changes, and let GitHub Actions publish.
- Local editing: edit files in `content/`, run `docker compose up --build` for static preview or `docker compose --profile dev up` for live reload, then commit and push.
- npm commands are optional for maintainers who already have Node.js 26; Docker is the preferred team workflow.
- Team members usually edit `content/`; `src/` is for layout and styling changes.

## Test Plan

- Verify `npm run build` creates static `dist/`.
- Verify Docker local preview serves the site.
- Verify all six routes render correctly.
- Verify Markdown edits update pages without changing Astro code.
- Check desktop and mobile layouts for nav, logo sizing, text wrapping, color contrast, and footer links.
- Check GitHub Actions workflow builds and uploads the Pages artifact.
- Confirm no secrets, server-only code, or dynamic runtime dependencies are introduced.

## Assumptions

- Final custom domain is expected to be `www.bsidesdetroit.org`, but DNS may come later.
- Initial site is a holding page, not a full conference-management site.
- CFP and volunteer pages are excluded for v1 and may later redirect to subdomains.
- Discord URL, contact email, dates, stats, sponsor details, and real code of conduct copy will be added after scaffolding.
