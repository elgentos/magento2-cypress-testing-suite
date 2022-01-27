import selectors from "../fixtures/selectors/hyva/search.json";

export class Search {
    static search(key) {
        cy.get(selectors.headerSearchIcon).click();
        cy.get(selectors.headerSearchField).type(`${key}{enter}`);
    }
}
