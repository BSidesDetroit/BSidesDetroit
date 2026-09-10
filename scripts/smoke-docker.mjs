import { spawnSync } from "node:child_process";
import { runSmokeChecks } from "./smoke-pages.mjs";

const hostPort = process.env.SITE_PORT ?? process.env.SMOKE_DOCKER_PORT ?? "4322";

const composeEnv = {
  ...process.env,
  COMPOSE_PROJECT_NAME: process.env.COMPOSE_PROJECT_NAME ?? "bsides-smoke",
  SITE_PORT: hostPort,
};

function runDockerCompose(args, { failOnError = true } = {}) {
  const result = spawnSync("docker", ["compose", ...args], {
    env: composeEnv,
    stdio: "inherit",
  });

  if (failOnError && result.status !== 0) {
    throw new Error(`docker compose ${args.join(" ")} failed.`);
  }
}

try {
  runDockerCompose(["up", "--build", "-d", "site"]);
  await runSmokeChecks({
    baseUrl: process.env.SMOKE_BASE_URL ?? `http://localhost:${hostPort}`,
  });
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  runDockerCompose(["down"], { failOnError: false });
}
