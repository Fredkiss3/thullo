/// <reference types="cypress" />

describe('Cypress', () => {
    // before(() => {
    //     // launch the login command without any args
    //     // @ts-ignore
    //     cy.login();
    // });

    // after(() => {
    //     // launch the login command without any args
    //     // @ts-ignore
    //     cy.logout();
    // });

    it('Can add a board', () => {
        cy.visit('/');

        // intercepts the api query 'http://localhost:3031/api/boards/'
        cy.intercept('GET', '**/api/auth/me', {
            fixture: '../fixtures/user.json',
        }).as('getUser');

        cy.intercept('GET', '**/api/boards/', {
            body: {
                data: [],
                errors: null,
            },
        });

        cy.intercept('POST', '**/api/boards', {
            statusCode: 201,
            fixture: '../fixtures/post-board.json',
        }).as('PostBoard');

        cy.intercept('GET', '**/api/proxy/unsplash/random', {
            fixture: '../fixtures/unsplash/random.json',
        }).as('getRandomPhoto');

        cy.intercept('GET', '**/api/proxy/unsplash/list', {
            fixture: '../fixtures/unsplash/list.json',
        }).as('getListPhotos');

        cy.intercept('GET', '**/api/proxy/unsplash/search?query=**', {
            fixture: '../fixtures/unsplash/search.json',
        }).as('searchPhoto');

        cy.contains('Add Board')
            .click()
            .then(() => {
                cy.get('[data-test-id="addboard-form"]')
                    .within(($el) => {
                        cy.wrap($el)
                            // fill the title
                            .get('[data-test-id="addboard-form-board-title"]')
                            .type('Cypress Test Board')
                            .wait(`@getRandomPhoto`)
                            // click the cover button
                            .get('[data-test-id="addboard-form-cover-button"]')
                            .click()
                            .wait(`@getListPhotos`)
                            // search a cover
                            .get('[data-test-id="photo-search"]')
                            .should('be.visible')
                            .find('input')
                            .type('test')
                            .wait(`@searchPhoto`)
                            .get('[data-test-id="photo-search-item"]')
                            .first()
                            .click()
                            .get('[data-test-id="addboard-form-close-button"]')
                            .click();
                    })
                    .submit();
            })
            .wait(`@PostBoard`)
            .then(() => {
                cy.intercept('GET', '**/api/boards/', {
                    statusCode: 200,
                    fixture: '../fixtures/get-boards.json',
                })
                    .as('getBoards')
                    .wait(`@getBoards`)
                    .then(() => {
                        cy.get('[data-test-id="user-board-list"]')
                            .find('[data-test-id="board-card-title"]')
                            .should('have.text', 'Cypress Test Board');
                    });
            });
    });

    it('can change the name of the board', () => {
        cy.visit('/');

        cy.intercept('GET', '**/api/auth/me', {
            fixture: '../fixtures/user.json',
        });

        cy.intercept('GET', '**/api/boards/6KGGyMhUSDf9K21MAWMfDr', {
            fixture: '../fixtures/get-board.json',
        });

        cy.intercept('PUT', '**/set-name', {
            statusCode: 200,
            body: {
                data: {
                    name: 'Cypress Test Board renamed',
                },
                errors: null,
            },
        }).as('RenameBoard');

        cy.intercept('GET', '**/api/boards/', {
            statusCode: 200,
            fixture: '../fixtures/get-boards.json',
        }).as('getBoards');

        cy.contains('Cypress Test Board')
            .click()
            .then(() => {
                cy.contains('Cypress Test Board')
                    .click()
                    .get('[data-test-id="page-title-input"]')
                    .clear()
                    .type('Cypress Test Board renamed')
                    .get('[data-test-id="page-header-divider"]')
                    .click()
                    .wait(`@RenameBoard`)
                    .then(() => {
                        cy.get('[data-test-id="page-title"]').should(
                            'have.text',
                            'Cypress Test Board renamed'
                        );
                    });
            });
    });
});
