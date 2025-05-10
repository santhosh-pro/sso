const Handlebars = require('handlebars');
const path = require('path');
const fs = require('fs');


const setHelpers = (plop) => {
  plop.setHelper('eq', (v1, v2) => v1 === v2);
  plop.setHelper('neq', (a, b) => a !== b);
  plop.setHelper('or', (...args) => args.slice(0, -1).some((arg) => Boolean(arg)));

   plop.setHelper('pathDashCase', (text) =>
    text
      .split('/')
      .map((part) => plop.getHelper('dashCase')(part))
      .join('/'),
  );

  plop.setHelper('includes', (string, substring) => {
    if (typeof string !== 'string' || typeof substring !== 'string') return false;
    return string.includes(substring);
  });

  plop.setHelper('cleanType', (type) => {
    if (typeof type !== 'string') return type;
    return type.replace('?', '');
  });

  plop.setHelper('raw', (text) => new Handlebars.SafeString(String(text)));

  plop.setHelper('removeNullable', (type) => {
    if (typeof type !== 'string') return type;
    return type.replace(/\?$/, '');
  });

  plop.setHelper('camelToLowerCaseWithSpaces', (text) => {
    if (typeof text !== 'string') return text;
    return text.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase();
  });

  const getKnownEnums = () => {
    const schemaPath = path.join(__dirname, '../prisma/schema.prisma');
    if (!fs.existsSync(schemaPath)) throw new Error(`Schema file not found at ${schemaPath}`);
    const schema = fs.readFileSync(schemaPath, 'utf8');
    const enumRegex = /enum\s+(\w+)\s*\{/g;
    const enums = [];
    let match;
    while ((match = enumRegex.exec(schema)) !== null) {
      enums.push(match[1]);
    }
    return enums;
  };

  plop.setHelper('isNullableEnum', (type) => {
    console.log('isNullableEnum enum type:', type);
    const knownEnums = getKnownEnums();
    if (typeof type !== 'string') return false;
    return type.endsWith('?') && knownEnums.includes(type.replace('?', ''));
  });

  plop.setHelper('isEnum', (type) => {
    console.log('enum type:', type);
    const knownEnums = getKnownEnums();
    if (typeof type !== 'string') return false;
    return knownEnums.includes(type.replace('?', ''));
  });

  const prismaToTypeScriptType = (prismaType) => {
    if (typeof prismaType !== 'string') return prismaType;
    const typeMap = {
      String: 'string',
      Int: 'number',
      Boolean: 'boolean',
      DateTime: 'Date',
    };
    return typeMap[prismaType.replace(/\?$/, '')] || prismaType.replace(/\?$/, '');
  };

  plop.setHelper('mapPrismaToTS', prismaToTypeScriptType);
};

module.exports = { setHelpers };