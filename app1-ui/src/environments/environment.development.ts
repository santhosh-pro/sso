
export const environment = {
    production: false,
    oidc: {
       //  issuer: 'http://localhost:8080/realms/master',
        issuer: 'http://localhost:3000',
        clientId: 'app1',
        redirectUri: 'http://localhost:4200/callback',
        logoutUri: 'http://localhost:4200',
    }
};
