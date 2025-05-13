
export const environment = {
    production: false,
    oidc: {
       // issuer: 'http://localhost:8080/realms/master',
        issuer: 'http://localhost:3000',
        clientId: 'app2',
        redirectUri: 'http://localhost:4202/callback',
        logoutUri: 'http://localhost:4202',
    }
};
