export class Search {
    static search(key) {
        cy.get('#menu-search-icon').click()
        cy.get('#search').type(`${key}{enter}`)
    }
}
