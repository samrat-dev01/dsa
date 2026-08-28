import * as fs from "node:fs";

// Hardcoded array of directories to scan
const targetFolders = ["algorithms", "data_structures"];

targetFolders.forEach(targetPath => {
  console.log(`\n--- Inside: ${targetPath} ---`);
  
  try {
    fs.readdirSync(targetPath, { withFileTypes: true })
      .filter(item => item.isDirectory())
      .forEach(dir => console.log(`  ${dir.name}`));
  } catch (error) {
    console.error(`  Error reading path "${targetPath}":`, error.message);
  }
});
