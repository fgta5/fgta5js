import fs from 'fs';

const pkgPath = './package.json';
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));

let [major, minor, patch] = pkg.version.split('.').map(Number);
patch += 1;

pkg.version = `${major}.${minor}.${patch}`;
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));

console.log(`Version bumped to ${pkg.version}`);