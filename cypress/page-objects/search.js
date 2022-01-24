export class Search {
    static search(key) {
        if (Cypress.env('isLuma')) {
            cy.get('#search').click()
            cy.get('#search').type(`${key}{enter}`)
        }

        if (Cypress.env('isHyva')) {
            cy.get('#menu-search-icon').click()
            cy.get('#search').type(`${key}{enter}`)
        }
    }
}
