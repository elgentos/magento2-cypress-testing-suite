Cypress.Commands.add('login', (email, pw) => {
    it('Test login', () => {
        cy.visit('/customer/account/login/')
        cy.get('#email').type(`${email}`, {force:true})
        cy.get('#pass').type(`${pw}{enter}`, {force:true})
        //cy.get('#login-form').contains('Inloggen').click({force:true})
    })
})
