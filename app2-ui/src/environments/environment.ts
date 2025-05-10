export const environment = {
    production: false,
    oidc: {
        issuer: 'http://localhost:8080/realms/master',
        clientId: 'app2',
        redirectUri: 'http://localhost:4202',
    }
};
