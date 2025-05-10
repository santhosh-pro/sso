const { setHelpers } = require('./helpers');
const { getModuleDetails } = require('./utils');
const { generateActionsForBlankAPI } = require('./actions/blank-api');
const { generateActionsForCRUDAPI } = require('./actions/curd-api');
const { generateActionsForService } = require('./actions/service');

module.exports = function (plop) {
  // Register helpers
  setHelpers(plop);

  // Plop generator
  plop.setGenerator('Code Generator', {
    description: 'Generate code for a new API endpoint or service',
    prompts: [
      {
        type: 'list',
        name: 'category',
        message: 'Select a category:',
        choices: ['API', 'Service'],
      },
      {
        when: (answers) => answers.category === 'API',
        type: 'list',
        name: 'subCategory',
        message: 'Select a sub-category:',
        choices: ['Blank',],
        // choices: ['Blank', 'CURD'],
      },
      {
        when: (answers) => answers.category === 'API',
        type: 'list',
        name: 'httpMethod',
        message: 'Select HTTP method:',
        choices: ['GET', 'POST', 'PUT', 'DELETE'],
      },
      {
        when: (answers) => answers.httpMethod === 'GET' && answers.category === 'API',
        type: 'list',
        name: 'getMethodType',
        message: 'Select GET method type:',
        choices: [
          { name: 'Query Params', value: 'queryParams' },
          { name: 'Path Params', value: 'pathParams' },
        ],
      },
      {
        when: (answers) => answers.category === 'API',
        type: 'input',
        name: 'apiName',
        message: 'API Name:',
      },
      {
        when: (answers) => answers.category === 'API',
        type: 'input',
        name: 'apiGroupName',
        message: 'API Group Name:',
      },
      {
        when: (answers) => answers.category === 'API',
        type: 'input',
        name: 'routePath',
        message: 'Route Path:',
      },
      {
        when: (answers) => answers.category === 'API' && answers.subCategory === 'CURD',
        type: 'input',
        name: 'entityName',
        message: 'Entity Model Name:',
      },
      {
        when: (answers) => answers.category === 'API',
        type: 'confirm',
        name: 'isAuth',
        message: 'Require authentication?',
        default: true,
      },
      {
        when: (answers) => answers.category === 'Service',
        type: 'input',
        name: 'serviceName',
        message: 'Service Name:',
      },
    ],
    actions: (data) => {
      const { name: moduleName } = getModuleDetails(process.env.INIT_CWD || process.cwd());
      data.module = moduleName;
      console.log('moduleName', moduleName);
      switch (data.subCategory) {
        case 'Blank':
          return generateActionsForBlankAPI(plop, data);
        case 'CURD':
          return generateActionsForCRUDAPI(plop, data);
        default:
          return generateActionsForService(data);
      }
    },
  });
};
