describe('Cypress', () => {
    it('visits the app', () => {
        cy.visit('/');
        cy.get('button')
            .click()
            .click()
            .click()
            .should('have.text', 'count is: 3');
    })
})