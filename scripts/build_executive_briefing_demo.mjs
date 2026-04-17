import path from "node:path";
import { runExecutiveBriefingDemo } from "../src/executive-briefing/demo.mjs";

const rootDir = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const result = await runExecutiveBriefingDemo({ rootDir });

console.log(result.paths.workbookPath);
console.log(result.paths.deckPath);
console.log(result.paths.summaryPath);
console.log(result.paths.reportPath);
