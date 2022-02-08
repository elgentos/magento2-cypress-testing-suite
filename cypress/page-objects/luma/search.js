import {isMobile} from "../../support/utils";

export class Search {
    static search(key) {
        if(isMobile()) {
            cy.get('#search_mini_form > .field > .label').click()
        }
        cy.get('#search').click()
        cy.get('#search').type(`${key}{enter}`)
    }
}
