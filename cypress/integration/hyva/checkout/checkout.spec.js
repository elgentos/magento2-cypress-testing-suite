import account from '../../../fixtures/account'
import product from '../../../fixtures/hyva/product'
import checkout from '../../../fixtures/checkout'
import selectors from '../../../fixtures/hyva/selectors/checkout'
import {Checkout} from "../../../page-objects/hyva/checkout";
import {Account} from "../../../page-objects/hyva/account";

/* These tests apply to the Luna checkout */
describe("Checkout tests", () => {
    it("Can see the correct product price and shipping costs", () => {
        Checkout.addSimpleProductToCart(product.simpleProductUrl);
        cy.get(selectors.productPrice).then(($PDPprice) => {
            expect(/\$\d+\.\d{2}/.test($PDPprice[0].innerText.trim())).to.be
                .true;
            const PDPPrice = $PDPprice[0].innerText.trim();
            cy.visit(checkout.checkoutUrl);
            Checkout.enterShippingAddress(checkout.shippingAddress);
            cy.get(".justify-around > .btn").click();
            cy.get(".flex > .mt-2 > .inline-block").click();
            cy.get(selectors.checkoutSubtotalPrice).then(($checkoutPrice) => {
                // The price has some form of "$12.32"
                const checkoutPrice = $checkoutPrice[0].innerText.trim();
                expect($checkoutPrice[0].innerText.trim()).to.equal(PDPPrice);
                expect(/\$\d+\.\d{2}/.test($checkoutPrice[0].innerText.trim()))
                    .to.be.true;
                cy.get(selectors.checkoutShippingPrice).then(
                    ($shippingPrice) => {
                        const shippingPrice =
                            $shippingPrice[0].innerText.trim();
                        expect(/\$\d+\.\d{2}/.test(shippingPrice)).to.be.true;
                        cy.get(".mt-3 > .flex > :nth-child(2)").then(
                            ($totalPrice) => {
                                const totalPrice =
                                    $totalPrice[0].innerText.trim();
                                expect(/\$\d+\.\d{2}/.test(totalPrice)).to.be
                                    .true;
                                expect(
                                    +checkoutPrice.slice(1) +
                                    +shippingPrice.slice(1)
                                ).to.equal(+totalPrice.slice(1));
                            }
                        );
                    }
                );
            });
        });
    });

    it("Can see coupon discount in checkout", () => {
        Checkout.addSimpleProductToCart(product.couponProductUrl);
        Checkout.addCoupon(product.couponCode);
        cy.get(selectors.cartSummeryDiscount).should("be.visible");
        cy.visit(checkout.checkoutUrl);
        cy.get(selectors.checkoutSubtotalPrice).then(($totalsPrice) => {
            const price = +$totalsPrice[0].innerText.match(/\d+\.\d\d/g)[0];
            cy.get(selectors.checkoutDiscountPrice).then(($discount) => {
                const discount = +$discount[0].innerText.match(/\d+\.\d\d/g)[0];
                cy.get(selectors.checkoutTotalPrice).then(($total) => {
                    const total = +$total[0].innerText.match(/\d+\.\d\d/g)[0];
                    expect(+total.toFixed(1)).to.equal(
                        +(price - discount).toFixed(1)
                    );
                });
            });
        });
    });

    it("Can find and order in the customer order history after having placed an order", () => {
        Checkout.addSimpleProductToCart(product.simpleProductUrl);
        Account.login(
            account.customer.customer.email,
            account.customer.password
        );
        cy.visit(checkout.checkoutUrl, { timeout: 5000 });
        cy.get(selectors.checkoutContainer).then(($checkout) => {
            // cy.wait(4000);
            // if customer has a default shipping address no new shipping address needs to be entered
            if (
                !$checkout[0].querySelectorAll(selectors.addressSelected).length
            ) {
                cy.get(selectors.addressSelected).should("not.exist");
                Checkout.enterShippingAddress(checkout.shippingAddress);
                cy.get(selectors.saveAddressBtn).click();
            }
            cy.get(selectors.addressSelected).should("exist");
            cy.get(selectors.shippingMethodField).click();
            cy.get(selectors.moneyOrderPaymentMethodSelector).click();
            cy.get(selectors.placeOrderBtn).click();
            cy.get(selectors.shippingAddressButtons).should(
                "not.contain.text",
                "Save"
            );
            cy.get(selectors.orderConfirmationOrderNumber).then(($orderNr) => {
                cy.visit(checkout.orderHistoryUrl);
                cy.get(selectors.accountViewOrder).first().click();
                cy.get(selectors.orderHistoryOrderNumber).then(
                    ($orderHistoryOrderNr) => {
                        cy.log($orderNr);
                        const orderNrRegex = /\d{9}/;
                        const orderNr =
                            $orderNr[0].innerText.match(orderNrRegex)[0];
                        const orderHistoryNr =
                            $orderHistoryOrderNr[0].innerText.match(
                                orderNrRegex
                            )[0];
                        expect(orderNr).to.be.equal(orderHistoryNr);
                    }
                );
            });
        });
    });
});
