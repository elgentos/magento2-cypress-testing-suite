import minicart from "../../../fixtures/minicart"
import selectors from "../../../fixtures/luma/selectors/minicart"
import {checkAccessibility} from "../../../support/utils"

describe('Mini cart accessibility tests', () => {
    it('Check mini cart', () => {
        cy.restoreLocalStorage();
        cy.clearCookies();
        cy.visit(minicart.didiSportWatch)
        cy.get(selectors.addToCartButton).click()
        cy.wait(5000)
        cy.get(selectors.miniCartButton).click()
        cy.wait(2000)

        cy.injectAxe()
        checkAccessibility()
    })
})
