const path = require('path');

const { runNpmFormat } = require('../format');
const { deleteRequestFileIfPathParams } = require('../utils');

const generateActionsForBlankAPI = (plop,data) => {
  const destinationPath = process.env.INIT_CWD || process.cwd();
  const templatePath = path.resolve(__dirname, '../.templates/blank/api', data.httpMethod.toLowerCase());
  return [
    {
      type: 'addMany',
      destination: destinationPath,
      base: templatePath,
      templateFiles: `${templatePath}/**/*`,
      data: {
        apiName: data.apiName,
        apiGroupName: data.apiGroupName,
        routePath: data.routePath,
        httpMethod: data.httpMethod,
        moduleName: data.module,
        getMethodType: data.getMethodType ?? '',
        isAuth: data.isAuth,
      },
    },
    () => {
      deleteRequestFileIfPathParams(plop,destinationPath, data.apiName, data.getMethodType);
      return 'Request model file handling completed';
    },
    () => runNpmFormat(),
  ];
};

module.exports = { generateActionsForBlankAPI };