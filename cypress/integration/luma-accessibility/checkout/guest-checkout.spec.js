import {Checkout} from "../../../page-objects/luma/checkout";
import product from '../../../fixtures/luma/product'
import checkout from '../../../fixtures/checkout'
import selectors from '../../../fixtures/luma/selectors/checkout'
import {checkAccessibility} from "../../../support/utils"

describe('Guest checkout accessibility tests', () => {
    it('Check Checkout steps as guest', () => {
        cy.visit(product.simpleProductUrl)
        cy.get(selectors.addToCartButton).click()

        cy.wait(3000)
        cy.visit(checkout.checkoutUrl)
        cy.wait(5000)

        cy.injectAxe()
        // We need to set skip failures as true here otherwise the tests will not proceed to the next checkout step
        checkAccessibility(null, null, true)

        Checkout.enterShippingAddress(checkout.shippingAddress)
        cy.wait(3000)
        cy.get('.button.action.continue.primary').click()
        cy.wait(5000)

        cy.injectAxe()
        checkAccessibility()
    })
})
