
export const environment = {
    production: false,
    apiUrl: 'http://localhost:3000',
    oidc: {
      // issuer: 'http://localhost:8080/realms/master',
        issuer: 'http://localhost:3000',
        clientId: 'iam',
        redirectUri: 'http://localhost:7000/callback',
        logoutUri: 'http://localhost:7000',
    }
};
