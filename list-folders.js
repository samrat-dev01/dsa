import * as fs from "node:fs";
import * as path from "node:path";

// Hardcoded array of directories to scan
const targetFolders = ["algorithms", "data_structures"];

function printDirectory(dirPath, indent = "") {
  try {
    const items = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const item of items) {
      const fullPath = path.join(dirPath, item.name);

      // Skip test files
      if (item.isFile() && (item.name.includes(".test.") || item.name.includes(".md"))) {
        continue;
      }

      if (item.isDirectory()) {
        console.log(`${indent}📁 ${item.name}`);
        printDirectory(fullPath, `${indent}  `);
      } else {
        console.log(`${indent}📄 ${item.name}`);
      }
    }
  } catch (error) {
    console.error(
      `${indent}Error reading path "${dirPath}":`,
      error.message
    );
  }
}

targetFolders.forEach(targetPath => {
  console.log(`\n--- Inside: ${targetPath} ---`);
  printDirectory(targetPath, "  ");
});