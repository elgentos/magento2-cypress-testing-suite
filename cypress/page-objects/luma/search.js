export class Search {
    static search(key) {
        cy.get('#search').click()
        cy.get('#search').type(`${key}{enter}`)
    }
}
