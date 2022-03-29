import cart from '../../fixtures/luma/selectors/cart'

export class Cart {
    static addProductToCart(url) {
        cy.visit(url)
        cy.get(cart.addToCartButton).click()
    }

    static addCouponCode(code) {
        cy.intercept('**/rest/*/V1/guest-carts/*/totals-information')
            .as('totalsInformation')

        cy.visit(cart.cartUrl)
        cy.wait('@totalsInformation')
        cy.get(cart.couponDropdownSelector).click()
        cy.get(cart.couponInputField).type(code, {force: true})
        cy.get(cart.addCouponButton).click({force: true})
        cy.wait('@totalsInformation')
    }
}

