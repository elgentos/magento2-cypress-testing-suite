import cart from "../../fixtures/hyva/selectors/cart"

export class Cart {
    static addProductToCart(url) {
        cy.visit(url)
        cy.get(cart.product.addToCartButton).click()
    }

    static addCouponCode() {
        cy.visit(cart.url.cartUrl)
        cy.get(cart.cart.couponDropdownSelector).click()
        cy.get(cart.cart.couponInputField).type(cart.cart.couponCode)
        cy.get(cart.cart.addCouponButton).click()
        cy.wait(2000)
    }
}
