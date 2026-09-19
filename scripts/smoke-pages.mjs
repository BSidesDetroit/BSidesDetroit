import { setTimeout as sleep } from "node:timers/promises";
import { pathToFileURL } from "node:url";

const DEFAULT_BASE_URL = "http://localhost:4321";
const REQUEST_TIMEOUT_MS = 5000;

export const pages = [
  {
    path: "/",
    expectedText: [
      "BSides Detroit. Hack more. Help people. Secure all.",
      "BSides Detroit is back on the wire.",
      "2026 successful",
    ],
  },
  {
    path: "/about",
    expectedText: [
      "Who we are, why BSides Detroit exists",
      "community-run security conference model",
    ],
  },
  {
    path: "/past",
    expectedText: [
      "Past Events",
      "Explore the history of BSides Detroit through the details below",
    ],
  },
  {
    path: "/sponsor",
    expectedText: [
      "Sponsor BSides Detroit",
      "Sponsorship for the next event is not open yet",
    ],
  },
  {
    path: "/discord",
    expectedText: [
      "Join Discord",
      "discord.gg/VTxn4qWwdQ",
    ],
  },
  {
    path: "/code-of-conduct",
    expectedText: [
      "Code of Conduct",
      "Community Citizenship",
    ],
  },
];

function normalizeHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function assertExpectedText(page, html) {
  const pageText = normalizeHtml(html);
  const missingText = page.expectedText.filter((text) => !pageText.includes(text));

  if (missingText.length > 0) {
    throw new Error(
      `${page.path} is missing expected text: ${missingText
        .map((text) => `"${text}"`)
        .join(", ")}.`,
    );
  }
}

async function fetchWithTimeout(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

async function waitForSite(baseUrl, maxAttempts) {
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const response = await fetchWithTimeout(baseUrl);

      if (response.ok) {
        return;
      }
    } catch {
      // Keep retrying until the server is ready or maxAttempts is reached.
    }

    await sleep(1000);
  }

  throw new Error(`Site did not respond at ${baseUrl} after ${maxAttempts} attempts.`);
}

export async function runSmokeChecks({
  baseUrl = process.env.SMOKE_BASE_URL ?? DEFAULT_BASE_URL,
  maxAttempts = Number.parseInt(process.env.SMOKE_MAX_ATTEMPTS ?? "30", 10),
} = {}) {
  const normalizedBaseUrl = baseUrl.replace(/\/+$/, "");

  await waitForSite(normalizedBaseUrl, maxAttempts);

  for (const page of pages) {
    const url = `${normalizedBaseUrl}${page.path}`;
    const response = await fetchWithTimeout(url);

    if (!response.ok) {
      throw new Error(`${page.path} returned HTTP ${response.status}.`);
    }

    const html = await response.text();
    assertExpectedText(page, html);

    console.log(`ok ${page.path}`);
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  runSmokeChecks()
    .then(() => {
      console.log("Smoke checks passed.");
    })
    .catch((error) => {
      console.error(error.message);
      process.exitCode = 1;
    });
}
