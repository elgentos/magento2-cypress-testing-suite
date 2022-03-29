import 'cypress-localstorage-commands'
import globalSelectors from '../fixtures/globalSelectors.json'

Cypress.Commands.add('login', (email, pw) => {
    it('Test login', () => {
        cy.visit('/customer/account/login/')
        cy.get('#email').type(`${email}`, {force:true})
        cy.get('#pass').type(`${pw}{enter}`, {force:true})
        //cy.get('#login-form').contains('Inloggen').click({force:true})
    })
})

Cypress.Commands.add('shouldHavePageTitle', title => {
    cy.get(globalSelectors.pageTitle)
        .should('exist')
        .should('contain.text', title)
})

Cypress.Commands.add('shouldHaveSuccessMessage', message => {
    cy.get(globalSelectors.successMessage)
        .should('exist')
        .should('contain.text', message)
})

Cypress.Commands.add('shouldHaveErrorMessage', message => {
    cy.get(globalSelectors.errorMessage)
        .should('exist')
        .should('contain.text', message)
})
