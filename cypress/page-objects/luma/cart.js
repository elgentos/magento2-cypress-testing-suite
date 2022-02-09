import cart from "../../fixtures/luma/selectors/cart"

export class Cart {
    static addProductToCart(url) {
        cy.visit(url)
        cy.wait(5000)
        cy.get(cart.product.addToCartButton).click()
        cy.wait(5000)
    }

    static addCouponCode() {
        cy.visit(cart.url.cartUrl)
        cy.wait(3000)
        cy.get(cart.couponDropdownSelector).click({force: true})
        cy.get(cart.couponInputField).type(cart.couponCode)
        cy.get(cart.addCouponButton).click()
        cy.wait(3000)
    }
}

