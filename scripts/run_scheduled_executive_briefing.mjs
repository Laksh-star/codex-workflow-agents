import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { runExecutiveBriefingDemo } from "../src/executive-briefing/demo.mjs";
import { parseSlackChannelIds } from "../src/executive-briefing/adapters.mjs";

const execFileAsync = promisify(execFile);

async function getRemoteUrl(cwd) {
  try {
    const { stdout } = await execFileAsync("git", ["remote", "get-url", "origin"], { cwd });
    return stdout.trim();
  } catch {
    return "";
  }
}

const rootDir = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const slack = {
  token: process.env.SLACK_BOT_TOKEN || "",
  channelIds: parseSlackChannelIds(process.env.SLACK_CHANNEL_IDS || ""),
  apiBaseUrl: process.env.SLACK_API_BASE_URL || undefined,
};
const github = {
  token: process.env.GITHUB_TOKEN || "",
  owner: process.env.GITHUB_OWNER || "",
  repo: process.env.GITHUB_REPO || "",
  remoteUrl: await getRemoteUrl(rootDir),
  apiBaseUrl: process.env.GITHUB_API_BASE_URL || undefined,
};

const result = await runExecutiveBriefingDemo({
  rootDir,
  slack,
  github,
  generatedOn: new Date().toISOString().slice(0, 10),
});

console.log(result.paths.workbookPath);
console.log(result.paths.deckPath);
console.log(result.paths.summaryPath);
console.log(result.paths.reportPath);
console.log(result.paths.narrativePath);
