import cart from '../../fixtures/luma/selectors/cart'

export class Cart {
    static addProductToCart(url) {
        cy.visit(url)
        cy.get(cart.product.addToCartButton).click()
    }

    static addCouponCode(code) {
        cy.intercept('**/rest/default/V1/guest-carts/*/estimate-shipping-methods')
            .as('estimateShippingMethod')

        cy.visit(cart.cartUrl)
        cy.wait('@estimateShippingMethod')
        cy.get(cart.couponDropdownSelector).click()
        cy.get(cart.couponInputField).type(code, {force: true})
        cy.get(cart.addCouponButton).click({force: true})
        cy.wait('@estimateShippingMethod')
    }
}

