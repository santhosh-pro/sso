const fs = require('fs');
const path = require('path');

const getKnownEnums = () => {
  const schemaPath = path.join(__dirname, '../prisma/schema.prisma');
  const schema = fs.readFileSync(schemaPath, 'utf8');

  const enumRegex = /enum\s+(\w+)\s*\{/g;
  const enums = [];
  let match;

  while ((match = enumRegex.exec(schema)) !== null) {
    enums.push(match[1]);
  }

  return enums;
};

const getModelFields = (modelName, excludeFields = []) => {
  const schemaPath = path.join(__dirname, '../prisma/schema.prisma'); // Adjust path if necessary
  if (!fs.existsSync(schemaPath)) {
    throw new Error(`Prisma schema file not found at ${schemaPath}`);
  }

  const schema = fs.readFileSync(schemaPath, 'utf8');
  const modelRegex = new RegExp(`model\\s+${modelName}\\s+\\{([^}]*)\\}`, 'm');
  const modelMatch = schema.match(modelRegex);

  if (!modelMatch) {
    throw new Error(`Model "${modelName}" not found in schema.`);
  }

  const modelDefinition = modelMatch[1];
  const fieldRegex = /^\s*(\w+)\s+([\w?]+)\s*/gm;
  const fields = [];
  let match;

  while ((match = fieldRegex.exec(modelDefinition)) !== null) {
    const fieldName = match[1];
    const fieldType = match[2];
    const isRequired = !fieldType.endsWith('?');
    if (!excludeFields.includes(fieldName)) {
      fields.push({ name: fieldName, type: fieldType.replace('?', ''), required: isRequired });
    }
  }

  return fields;
};

const getModuleDetails = (destinationPath) => {
  const modules = [
    {
        name: 'Admin',
        filePath: '/workspaces/ysc-server/src/features/api/admin',
    },
    {
        name: 'Company',
        filePath: '/workspaces/ysc-server/src/features/api/company',
    },
    {
        name: 'WebSite',
        filePath: '/workspaces/ysc-server/src/features/api/website',
    },
    {
        name: 'Common',
        filePath: '/workspaces/ysc-server/src/features/api/_common',
    },
];
  const module = modules.find((mod) => destinationPath.includes(mod.filePath.replace(/\/[^/]+\.module\.ts$/, '')));
  return module || { name: '', filePath: null }; // Return defaults if not found
};

  const getNormalizedRelativePath = (plop,appendPath, destinationPath, name) => {
    const relativePath = path.relative(path.dirname(appendPath), path.join(destinationPath, plop.getHelper('dashCase')(name)));
    return `./${relativePath.replace(/\\/g, '/')}`;
  };

  const deleteRequestFileIfPathParams = (plop,destinationPath, apiName, getMethodType) => {
    if (getMethodType === 'pathParams') {
      const requestFilePath = path.join(destinationPath, `${plop.getHelper('dashCase')(apiName)}/${plop.getHelper('dashCase')(apiName)}-request.ts`);
      if (fs.existsSync(requestFilePath)) {
        fs.unlinkSync(requestFilePath);
        console.log(`Deleted request model file: ${requestFilePath}`);
      } else {
        console.log(`Request model file not found: ${requestFilePath}`);
      }
    }
  };

module.exports = { getKnownEnums,getModelFields, getModuleDetails,getNormalizedRelativePath, deleteRequestFileIfPathParams };