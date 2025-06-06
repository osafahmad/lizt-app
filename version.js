let fs = require('fs');

if (fs.existsSync('./package.json')) {
  var pack = require('./package.json');
  let currentVersion = pack.buildVersion;
  let newVersion = currentVersion + 1;
  pack.buildVersion = newVersion;
  fs.writeFileSync('./package.json', JSON.stringify(pack, null, 2));
  console.log('Version updated', currentVersion, '=>', newVersion);
}
