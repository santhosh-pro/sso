const fs = require('fs');
const path = require('path');

const apiServicePath = path.resolve(__dirname, 'src/app/core/api/api.service.ts');
const environmentImport = "import { environment } from '@environments/environment';\n";

fs.readFile(apiServicePath, 'utf8', (err, data) => {
  if (err) {
    return console.error(err);
  }

  let result = data.replace(/__BASE_URL__/g, '${environment.apiUrl}');
  if (!data.includes(environmentImport)) {
    result = environmentImport + result;
  }

  fs.writeFile(apiServicePath, result, 'utf8', (err) => {
    if (err) return console.error(err);
  });
});