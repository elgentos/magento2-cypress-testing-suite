import cart from "../../../fixtures/hyva/selectors/cart.json";
import { Cart } from "../../../page-objects/hyva/cart";
import {isMobileHyva} from "../../../support/utils";

describe("Isolated test for adding a product to the cart", () => {
    it("can add a product to the cart", () => {
        Cart.addProductToCart(cart.url.product1Url);
        cy.get(cart.product.messageToast)
            .should("include.text", "to your shopping cart")
            .should("be.visible");
    });
});

describe("Cart tests", () => {
    beforeEach(() => {
        Cart.addProductToCart(cart.url.product1Url);
        cy.visit(cart.url.cartUrl);
        cy.wait(3000);
    });

    it("Can change the quantity in the cart", () => {
        cy.get(cart.qtyInputField)
            .type("{backspace}2{enter}")
            .should("have.value", "2");
    });

    it("Can remove a product from the cart", () => {
        if(isMobileHyva()) {
            cy.get(cart.deleteProductButtonMobile).click();
        } else {
            cy.get(cart.deleteProductButton).click();
        }
        cy.get(cart.emptyCartTextField)
            .should("include.text", "You have no items in your shopping cart.")
            .should("be.visible");
    });

    it("Can add a coupon to the cart", () => {
        Cart.addProductToCart(cart.url.product2Url);
        Cart.addCouponCode(cart.couponCode);
        cy.get(cart.cartSummaryTable)
            .should("include.text", "Coupons/Discounts")
            .should("be.visible");
    });

    it("Can delete an added coupon from the cart", () => {
        Cart.addProductToCart(cart.url.product2Url);
        Cart.addCouponCode(cart.couponCode);
        cy.get(cart.cartSummaryTable)
            .should("include.text", "Coupons/Discounts")
            .should("be.visible");
        Cart.removeCoupon();
        cy.get(cart.cartSummaryTable)
            .should("include.text", "Coupons/Discounts")
            .should("not.be.visible");
    });

    it("Cannot add a non existing coupon", () => {
        cy.get(cart.couponDropdownSelector).click();
        cy.get(cart.couponInputField).type("wrong coupon code");
        cy.get(cart.addCouponButton).click();
        cy.wait(2000)
        cy.get(cart.messageToast)
            .should(
                "include.text",
                "The coupon code isn't valid. Verify the code and try again."
            )
            if(!isMobileHyva()) {
                cy.get(cart.messageToast)
                    .should("be.visible");
            }
    });

    it("Displays the correct product prices and totals", () => {
        cy.visit(cart.url.product1Url);

        //check if product price matches with price in cart
        cy.wait(1000)
        cy.get(cart.product.productPrice).then(($productPrice) => {
            const productPrice = $productPrice[0].textContent.trim();

            Cart.addProductToCart(cart.url.product2Url);
            cy.wait(1000)
            cy.visit(cart.url.cartUrl);
            cy.wait(1000)
            cy.get(cart.product1Price).should("have.text", productPrice);

            //change the qty value
            cy.get(cart.qtyInputField)
                .eq(0)
                .type("{backspace}2{enter}")
                .then(($qty) => {
                    const qty = parseInt($qty.val());
                    cy.wait(3000);

                    //check if qty * product subtotal displays the correct amount
                    cy.get(cart.product1Subtotal).then(($subTotal) => {
                        const subTotal = parseInt(
                            $subTotal[0].textContent.trim().slice(1)
                        );
                        expect(parseInt(productPrice.slice(1)) * qty).to.equal(
                            subTotal
                        );
                    });
                });
        });

        //check if the grand total is correct
        cy.get(cart.product1Subtotal).then(($total1) => {
            const subTotal1 = parseInt($total1[0].textContent.trim().slice(1));

            cy.get(cart.product2Subtotal).then(($total2) => {
                const subTotal2 = parseInt(
                    $total2[0].textContent.trim().slice(1)
                );

                cy.get(cart.grandTotal).then(($grandTotal) => {
                    const grandTotal = parseInt(
                        $grandTotal[0].textContent.trim().slice(1)
                    );
                    expect(grandTotal).to.equal(subTotal1 + subTotal2);
                });
            });
        });
    });

    it("merges an already existing cart when a customer logs in", () => {
        //test goes here
    });
});
