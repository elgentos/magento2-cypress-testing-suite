import product from "../../../fixtures/luma/product"
import {checkAccessibility} from "../../../support/utils"

describe('Configurable products accessibility test suite', () => {
    it('Check configurable product', () => {
        cy.visit(product.configurableProductUrl)
        cy.wait(1000)

        cy.injectAxe()
        checkAccessibility()
    })
})
