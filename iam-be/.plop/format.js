const { exec } = require('child_process');

const runNpmFormat = () => {
  return new Promise((resolve, reject) => {
    exec('npm run format', (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve(stdout || stderr);
      }
    });
  });
};

module.exports = { runNpmFormat };