import product from "../../../fixtures/luma/product"
import {checkAccessibility} from "../../../support/utils"

describe('Simple Product accessibility test suite', () => {
    it('Check simple product', () => {
        cy.visit(product.simpleProductUrl)
        cy.wait(2000)

        cy.injectAxe()
        checkAccessibility()
    })
})
