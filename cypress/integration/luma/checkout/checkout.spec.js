import {Checkout} from "../../../page-objects/luma/checkout";
import {Account} from "../../../page-objects/luma/account";
import account from '../../../fixtures/account'
import product from '../../../fixtures/luma/product'
import checkout from '../../../fixtures/checkout'
import selectors from '../../../fixtures/selectors/luma/checkout'
import {isMobile} from "../../../support/utils";

describe('Checkout tests', () => {
    it('Can see the correct product price and shipping costs', () => {
        cy.visit(product.simpleProductUrl)
        cy.get(selectors.addToCartButton).click()
        cy.get(selectors.productPrice).then(($PDPprice) => {
            expect($PDPprice).to.be.contain(selectors.currency)
            const PDPPrice = $PDPprice[0].innerText.trim()
            cy.wait(3000)
            cy.visit(checkout.checkoutUrl)
            cy.wait(5000)
            Checkout.enterShippingAddress(checkout.shippingAddress)
            cy.wait(3000)
            cy.get('.button.action.continue.primary').click()
            cy.wait(7000)
            if(isMobile()) {
                cy.get('.action.showcart').click()
            }
            cy.get(selectors.checkoutPrice).then(($checkoutPrice) => {
                const checkoutPrice = $checkoutPrice[0].innerText.trim()
                expect($checkoutPrice[0].innerText.trim()).to.equal(PDPPrice)
                cy.get(selectors.checkoutShippingPrice).then(($shippingPrice) => {
                    const shippingPrice = $shippingPrice[0].innerText.trim()
                    cy.get(selectors.totalPrice).then(($totalPrice) => {
                        const totalPrice = $totalPrice[0].innerText.trim().slice(1)
                        expect((parseFloat(checkoutPrice.slice(1))) + (parseFloat(shippingPrice.slice(1)))).to.equal(parseFloat(totalPrice))
                    })
                })
            })
        })
    })

    it('Can see coupon discount in checkout', () => {
        Checkout.addProductToCart(product.couponProductUrl)
        cy.wait(3000)
        Checkout.addCoupon(product.couponCode)
        cy.wait(5000)
        cy.get(selectors.cartDiscount).then(($cartDiscount) => {
            const cartDiscount = parseFloat($cartDiscount[0].innerText.trim().slice(2))
            cy.visit(checkout.checkoutUrl)
            cy.wait(7000)
            Checkout.enterShippingAddress(checkout.shippingAddress)
            cy.wait(3000)
            cy.get('.button.action.continue.primary').click()
            cy.wait(10000)
            if(isMobile()) {
                cy.get('.action.showcart').click()
            }
            cy.get(selectors.checkoutDiscountPrice).then(($discount) => {
                const discount = parseFloat($discount[0].innerText.trim().slice(2))
                expect(discount).to.equal(cartDiscount)
            })
        })
    })

    it('can find and order in the customer order history after having placed an order', () => {
        cy.visit(product.simpleProductUrl)
        cy.get(selectors.addToCartButton).click()
        cy.wait(3000)
        Account.login(account.customer.customer.email, account.customer.password)
        cy.visit(checkout.checkoutUrl)
        cy.wait(5000)
        cy.get(selectors.addressSelected).should('exist')
        cy.get(selectors.checkoutBtn).click()
        cy.wait(4000)
        cy.get(selectors.moneyOrderPaymentMethodSelector).check({force: true})
        cy.get(selectors.moneyOrderPaymentMethodSelector).should('be.checked')
        cy.wait(3000)
        cy.contains('Place Order').should('be.visible').click({force: true})
        cy.wait(7000)
        cy.get(selectors.orderConfirmationOrderNumber).then(($orderNr) => {
            const orderNr = $orderNr[0].innerText.trim()
            cy.log(orderNr)
            cy.visit(checkout.orderHistoryUrl)
            cy.wait(3000)
            cy.get(selectors.orderHistoryOrderNumber).then(($orderHistoryOrderNr) => {
                const orderNrHistory = $orderHistoryOrderNr[0].innerText.trim()
                cy.log(orderNrHistory)
                expect(orderNr).to.be.equal(orderNrHistory)
            })
        })
    })
})
