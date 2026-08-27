import * as fs from "node:fs"


fs.readdirSync('.', { withFileTypes: true })
  .filter(item => item.isDirectory())
  .forEach(dir => console.log(dir.name));
