const path = require('path');

const { getKnownEnums, getModelFields } = require('../utils');
const { runNpmFormat } = require('../format');

const generateActionsForCRUDAPI = (plop,data) => {
  const destinationPath = process.env.INIT_CWD || process.cwd();
  const templatePath = path.resolve(__dirname, '../.templates/crud', data.httpMethod.toLowerCase());

  const excludeFields = ['id', 'createdBy', 'updatedBy', 'createdAt', 'updatedAt', 'createdIp', 'updatedIp'];
  const fields = getModelFields(data.entityName, excludeFields);
  const knownEnums = getKnownEnums();

  console.log('fields:', fields);

  const decodeHtmlEntities = (text) =>
    text.replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&');

  const enumImports = fields
    .filter((field) => knownEnums.includes(field.type.replace('?', ''))) // Check if field type is an enum
    .map((field) => decodeHtmlEntities(`import { ${field.type.replace('?', '')} } from '@prisma/client';`));

  const uniqueEnumImports = [...new Set(enumImports)];

  const actions = [
    {
      type: 'addMany',
      destination: destinationPath,
      base: templatePath,
      templateFiles: `${templatePath}/**/*`,
      data: {
        apiName: data.apiName,
        apiGroupName: data.apiGroupName,
        moduleName: data.module,
        fields: fields,
        enumImports: uniqueEnumImports,
        isAuth: data.isAuth,
      },
    },
    () => runNpmFormat(),
  ];

  return actions;
};

module.exports = { generateActionsForCRUDAPI };