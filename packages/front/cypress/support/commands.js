// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
Cypress.Commands.add('login', (email, password) => {
    cy.request('POST', 'http://localhost:3031/api/test/create-user').then(
        (response) => {
            // set cookie for the user
            cy.log('Set Token cookie :', {
                token: response.body.data.token,
            });
            cy.setCookie('token', response.body.data.token);
        }
    );
});

Cypress.Commands.add('logout', (email, password) => {
    cy.getCookie('token').then((cookie) => {
        cy.request({
            url: 'http://localhost:3031/api/test/delete-user',
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${cookie.value}`,
            },
        }).then((response) => {
            // DELETE cookie for the user
            cy.setCookie('token', '');
        });
    });
});
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
