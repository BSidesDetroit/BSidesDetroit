import { readFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { assertExpectedText, pages } from "./smoke-pages.mjs";

const distDir = resolve("dist");

function pageFilePath(pagePath) {
  if (pagePath === "/") {
    return join(distDir, "index.html");
  }

  return join(distDir, pagePath.replace(/^\/+/, ""), "index.html");
}

async function main() {
  try {
    for (const page of pages) {
      const html = await readFile(pageFilePath(page.path), "utf8");
      assertExpectedText(page, html);
      console.log(`ok ${page.path}`);
    }

    console.log("Built-site smoke checks passed.");
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

await main();
