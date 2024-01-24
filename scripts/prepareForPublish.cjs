const pkg = require('../package.json');
const fs = require("node:fs");
const path = require("node:path");

const updatedPkg = { ...pkg, exports: `./${pkg.main}` };
delete updatedPkg['type'];

fs.writeFileSync(
  path.join('..', 'package.json'),
  JSON.stringify(updatedPkg, null, 2),
);
