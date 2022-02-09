import cart from "../../fixtures/hyva/selectors/cart.json";

export class Cart {
    static addProductToCart(url) {
        cy.visit(url);
        cy.get(cart.product.addToCartButton).click();
    }

    static addCouponCode(couponCode) {
        cy.visit(cart.url.cartUrl);
        cy.get(cart.couponDropdownSelector).click();
        cy.get(cart.couponInputField).type(couponCode);
        cy.get(cart.addCouponButton).click();
        cy.wait(2000);
    }

    static removeCoupon() {
        cy.visit(cart.url.cartUrl);
        cy.get(cart.couponDropdownSelector).click();
        cy.get(cart.addCouponButton).click({
            force: true,
        });
    }
}
