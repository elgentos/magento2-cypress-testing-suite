import searchLuma from "../../../fixtures/luma/search"
import {checkAccessibility} from "../../../support/utils"
import selectorsLuma from "../../../fixtures/luma/selectors/search.json";

describe('Product search suggestions accessibility test', () => {
    it('Check search suggestions', () => {
        cy.visit('/')
        cy.get(selectorsLuma.headerSearchIcon).click()
        cy.get(selectorsLuma.headerSearchField)
            .should('be.visible')
            .type(`${searchLuma.getHint}`)

        cy.wait(3000)
        cy.injectAxe()
        checkAccessibility()
    })
})
