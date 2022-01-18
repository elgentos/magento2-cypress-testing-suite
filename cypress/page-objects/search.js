import selectors from "../fixtures/selectors/hyva/search"

export class Search {
    static search(key) {
        cy.get(selectors.menuSearchIcon).click()
        cy.get(selectors.searchField).type(`${key}{enter}`)
    }
}
