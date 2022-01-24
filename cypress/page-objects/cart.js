// Luma
import cartLuma from "../fixtures/selectors/luma/cart.json"

// Hyva
import cartHyva from "../fixtures/selectors/hyva/cart.json"

export class Cart {
    static addProductToCart(url) {
        if (Cypress.env('isLuma')) {
            cy.visit(url)
            cy.wait(5000)
            cy.get(cartLuma.product.addToCartButton).click()
            cy.wait(5000)
        }

        if (Cypress.env('isHyva')) {
            cy.visit(url)
            cy.get(cartHyva.product.addToCartButton).click()
        }
    }

    static addCouponCode() {
        if (Cypress.env('isLuma')) {
            cy.visit(cartLuma.url.cartUrl)
            cy.wait(3000)
            cy.get(cartLuma.couponDropdownSelector).click({force: true})
            cy.get(cartLuma.couponInputField).type(cartLuma.couponCode)
            cy.get(cartLuma.addCouponButton).click()
            cy.wait(3000)
        }

        if (Cypress.env('isHyva')) {
            cy.visit(cartHyva.url.cartUrl)
            cy.get(cartHyva.couponDropdownSelector).click()
            cy.get(cartHyva.couponInputField).type(cartHyva.couponCode)
            cy.get(cartHyva.addCouponButton).click()
            cy.wait(2000)
        }
    }
}

