import product from '../../../fixtures/luma/product'
import {checkAccessibility} from "../../../support/utils"

describe('Category page accessibility tests', () => {
    it('Check category page', () => {
        cy.visit(product.categoryUrl)
        cy.wait(3000)

        cy.injectAxe()
        checkAccessibility()
    })
})
