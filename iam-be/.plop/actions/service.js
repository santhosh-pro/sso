const { runNpmFormat } = require('../format');

const generateActionsForService = (data) => {
  const destinationPath = process.cwd();
  const templatePath = path.resolve(__dirname, '../.templates/blank/service', data.httpMethod.toLowerCase());

  return [
    {
      type: 'addMany',
      destination: destinationPath,
      base: templatePath,
      templateFiles: `${templatePath}/**/*`,
      data: { serviceName: data.serviceName },
    },
    () => runNpmFormat(),
  ];
};

module.exports = { generateActionsForService };