module.exports = {
  petstore: {
    output: {
      mode: 'single',
      target: 'src/app/core/api/api.service.ts',
      schemas: 'src/app/core/api/model',
      client: 'angular',
      mock: false,
      baseUrl: '__BASE_URL__',
    },
    input: {
      target: 'http://localhost:3000/docs-json',
    },
  },
};