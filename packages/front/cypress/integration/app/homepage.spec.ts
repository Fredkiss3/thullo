/// <reference types="cypress" />

describe('Cypress', () => {
    before(() => {
        // launch the login command without any args
        // @ts-ignore
        cy.login();
    });

    after(() => {
        // launch the login command without any args
        // @ts-ignore
        cy.logout();
    });

    it('Can add a public board', () => {
        cy.visit('/');

        // intercepts the api query 'http://localhost:3031/api/boards/'
        cy.intercept('GET', '**/api/boards/').as('getAllBoards');

        cy.contains('Add Board')
            .click()
            .then(() => {
                cy.get('[data-test-id="addboard-form"]')
                    .within(($el) => {
                        cy.wrap($el)
                            // fill the title
                            .get('[data-test-id="addboard-form-board-title"]')
                            .type('Cypress Test Board')
                            // click the cover button
                            .get('[data-test-id="addboard-form-cover-button"]')
                            .click()
                            // search a cover
                            .get('[data-test-id="photo-search"]')
                            .should('be.visible')
                            .find('input')
                            .type('test')
                            .wait(1000)
                            .get('[data-test-id="photo-search-item"]')
                            .first()
                            .click()
                            .get('[data-test-id="addboard-form-close-button"]')
                            .click();
                    })
                    .submit();
            })
            .wait(2000)
            .then(() => {
                cy.get('[data-test-id="user-board-list"]')
                    .find('[data-test-id="board-card-title"]')
                    .should('have.text', 'Cypress Test Board');
            });
    });
});
