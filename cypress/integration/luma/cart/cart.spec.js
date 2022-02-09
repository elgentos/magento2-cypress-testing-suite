import { Cart } from "../../../page-objects/luma/cart";
import cartLuma from "../../../fixtures/luma/selectors/cart";

describe("Isolated test for adding a product to the cart", () => {
    it("Can add a product to the cart", () => {
        Cart.addProductToCart(cartLuma.url.product1Url);
        cy.get(cartLuma.product.messageToast)
            .should(
                "include.text",
                "You added Didi Sport Watch to your shopping cart."
            )
            .should("be.visible");
    });
});

describe("Cart tests", () => {
    beforeEach(() => {
        Cart.addProductToCart(cartLuma.url.product1Url);
        cy.visit(cartLuma.url.cartUrl);
        cy.wait(3000);
    });

    it("Can change the quantity in the cart", () => {
        cy.get(cartLuma.qtyInputField)
            .type("{backspace}2{enter}")
            .should("have.value", "2");
    });

    it("Can remove a product from the cart", () => {
        cy.get(cartLuma.deleteProductButton).click();
        cy.get(cartLuma.emptyCartTextField)
            .should("include.text", "You have no items in your shopping cart.")
            .should("be.visible");
    });

    it("Can add a coupon to the cart", () => {
        Cart.addProductToCart(cartLuma.url.product2Url);
        Cart.addCouponCode();
        cy.get(cartLuma.cartSummaryTable)
            .should("include.text", "Discount")
            .should("be.visible");
    });

    it("cannot add a non existing coupon", () => {
        cy.get(cartLuma.couponDropdownSelector).click();
        cy.get(cartLuma.couponInputField).type("wrong coupon code");
        cy.get(cartLuma.addCouponButton).click();
        cy.get(cartLuma.messageToast)
            .should(
                "include.text",
                'The coupon code "wrong coupon code" is not valid.'
            )
            .should("be.visible");
    });
});
