const fs = require('fs');
try {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  let registry = null;
  for (let i = 0; i < process.argv.length; i++) {
    if (process.argv[i] === '-s') {
      registry = process.argv[++i];
      break;
    }
  }
  pkg.publishConfig = pkg.publishConfig || {};
  if (registry) {
    pkg.publishConfig.registry = registry;
  } else if (pkg.publishConfig.registry) {
    delete pkg.publishConfig.registry;
  }
  fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
} catch (err) {
  console.error('Error updating package.json:', err.message);
  process.exit(1);
}
