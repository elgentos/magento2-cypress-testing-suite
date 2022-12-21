import cart from "../../../fixtures/hyva/selectors/cart.json";
import account from "../../../fixtures/account.json";
import { Cart } from "../../../page-objects/hyva/cart";
import { Account } from "../../../page-objects/hyva/account";
import {isMobileHyva} from "../../../support/utils";

describe("Isolated test for adding a product to the cart", () => {
    it("Can add a product to the cart", () => {
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
        cy.get(cart.pageTitle).should("contain.text", "Shopping Cart")
    });

    it("Can change the quantity in the cart", () => {
        cy.get(cart.qtyInputField)
            .type("{backspace}2{enter}")
            .should("have.value", "2");
    });

    it("Can remove a product from the cart", () => {
        cy.get(cart.deleteProductButton).click();
        cy.get(cart.emptyCartTextField)
            .should("include.text", "You have no items in your shopping cart.")
            .should("be.visible");
    });

    it("Can add a coupon to the cart", () => {
        Cart.addProductToCart(cart.url.product2Url);
        Cart.addCouponCode(cart.couponCode);
        cy.get(cart.successMessages).should("contain.text", `You used coupon code "${cart.couponCode}"`)
        cy.get(cart.couponInputField).invoke('attr', 'value').should('eq', cart.couponCode)
        cy.get(cart.cartSummaryTable).should("include.text", "Discount")
        cy.get(cart.cartTotalLabels).contains("Discount").should("include.text", "Discount")
    });

    it("Can delete an added coupon from the cart", () => {
        Cart.addProductToCart(cart.url.product2Url);
        Cart.addCouponCode(cart.couponCode);
        cy.get(cart.cartSummaryTable).should("include.text", "Discount")
        Cart.removeCoupon();
        cy.get(cart.successMessages).should("contain.text", `You canceled the coupon code.`)
        cy.get(cart.cartSummaryTable).should("not.include.text", "Discount")
    });

    it("Cannot add an invalid coupon", () => {
        cy.get(cart.couponDropdownSelector).click();
        cy.get(cart.couponInputField).type("wrong coupon code");
        cy.get(cart.addCouponButton).click();
        cy.get(cart.messageToast)
            .should(
                "include.text",
                `The coupon code "wrong coupon code" is not valid.`
            )
            if (!isMobileHyva()) {
                cy.get(cart.messageToast)
                    .should("be.visible");
            }
    });

    it("Displays the correct product prices and totals", () => {
        cy.visit(cart.url.product1Url);


        //check if product price matches with price in cart
        cy.get(cart.product.productPrice).then(($productPrice) => {
            const productPrice = $productPrice[0].textContent.trim();

            Cart.addProductToCart(cart.url.product2Url);
            cy.get(cart.product.messageToast).should("include.text", "to your shopping cart")
            cy.visit(cart.url.cartUrl);
            cy.get(cart.pageTitle).should("contain.text", "Shopping Cart")
            cy.get(cart.productPrice).first().should("have.text", productPrice);

            cy.get('#shipping-estimate-toggle').click();
            //select country unlikely to have any tax rules
            cy.get('#shipping-zip-form select[name="country_id"]').select('Aruba')
            cy.get('#cart-totals svg.animate-spin').should('exist')
            cy.get('#cart-totals svg.animate-spin').should('not.exist')
            cy.wait(100)

            //change the qty value
            cy.get(cart.qtyInputField)
                .eq(0)
                .type("{backspace}2{enter}")
                .then(($qty) => {
                    const qty = parseInt($qty.val());
                    cy.wait(3000); // wait for page to reload with new prices

                    //check if qty * product subtotal displays the correct amount
                    cy.get(cart.productSubtotal).first().then(($subTotal) => {
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
        cy.get(cart.productSubtotal).eq(0).then(($total1) => {
            const subTotal1 = parseInt($total1[0].textContent.trim().slice(1));

            cy.get(cart.productSubtotal).eq(1).then(($total2) => {
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
});
