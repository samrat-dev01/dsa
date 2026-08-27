import { existsSync, statSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";

const target = process.argv[2] ?? ".";

function findTestFiles(directory) {
  const testFiles = [];

  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const fullPath = join(directory, entry.name);

    if (entry.isDirectory()) {
      testFiles.push(...findTestFiles(fullPath));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith(".test.js")) {
      testFiles.push(fullPath);
    }
  }

  return testFiles;
}

const targetPath = resolve(target);

if (!existsSync(targetPath)) {
  console.error(`❌ Path not found: ${target}`);
  process.exit(1);
}

const stat = statSync(targetPath);

let testFiles;

if (stat.isFile()) {
  if (!targetPath.endsWith(".test.js")) {
    console.error(`❌ File is not a test file: ${target}`);
    process.exit(1);
  }

  testFiles = [targetPath];
} else {
  testFiles = findTestFiles(targetPath);
}

if (testFiles.length === 0) {
  console.error(`❌ No .test.js files found in: ${target}`);
  process.exit(1);
}

console.log(`\n🧪 Running ${testFiles.length} test file(s)...\n`);

const result = spawnSync(
  process.execPath,
  ["--test", ...testFiles],
  {
    stdio: "inherit",
  }
);

process.exit(result.status ?? 1);