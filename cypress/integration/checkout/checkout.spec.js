import {Checkout} from "../../page-objects/checkout";
import {Account} from "../../page-objects/account";

// Luma imports
import accountLuma from '../../fixtures/luma/account'
import productLuma from '../../fixtures/luma/product'
import checkoutLuma from '../../fixtures/luma/checkout'
import selectorsLuma from '../../fixtures/selectors/luma/checkout'

// Hyva imports
import accountHyva from '../../fixtures/hyva/account'
import productHyva from '../../fixtures/hyva/product'
import checkoutHyva from '../../fixtures/hyva/checkout'
import selectorsHyva from '../../fixtures/selectors/hyva/checkout'

// Luma tests
if (Cypress.env('isLuma')) {
    describe('Checkout tests', () => {
        it('Can see the correct product price and shipping costs', () => {
            cy.visit(productLuma.simpleProductUrl)
            cy.get(selectorsLuma.addToCartButton).click()
            cy.get(selectorsLuma.productPrice).then(($PDPprice) => {
                expect($PDPprice).to.be.contain(selectorsLuma.currency)
                const PDPPrice = $PDPprice[0].innerText.trim()
                cy.wait(3000)
                cy.visit(checkoutLuma.checkoutUrl)
                cy.wait(5000)
                Checkout.enterShippingAddress(checkoutLuma.shippingAddress)
                cy.wait(3000)
                cy.get('.button.action.continue.primary').click()
                cy.wait(7000)
                cy.get(selectorsLuma.checkoutPrice).then(($checkoutPrice) => {
                    const checkoutPrice = $checkoutPrice[0].innerText.trim()
                    expect($checkoutPrice[0].innerText.trim()).to.equal(PDPPrice)
                    cy.get(selectorsLuma.checkoutShippingPrice).then(($shippingPrice) => {
                        const shippingPrice = $shippingPrice[0].innerText.trim()
                        cy.get(selectorsLuma.totalPrice).then(($totalPrice) => {
                            const totalPrice = $totalPrice[0].innerText.trim().slice(1)
                            expect((parseFloat(checkoutPrice.slice(1))) + (parseFloat(shippingPrice.slice(1)))).to.equal(parseFloat(totalPrice))
                        })
                    })
                })
            })
        })

        it('Can see coupon discount in checkout', () => {
            Checkout.addProductToCart(productLuma.couponProductUrl)
            cy.wait(3000)
            Checkout.addCoupon(productLuma.couponCode)
            cy.wait(5000)
            cy.get(selectorsLuma.cartDiscount).then(($cartDiscount) => {
                const cartDiscount = parseFloat($cartDiscount[0].innerText.trim().slice(2))
                cy.visit(checkoutLuma.checkoutUrl)
                cy.wait(7000)
                Checkout.enterShippingAddress(checkoutLuma.shippingAddress)
                cy.wait(3000)
                cy.get('.button.action.continue.primary').click()
                cy.wait(10000)
                cy.get(selectorsLuma.checkoutDiscountPrice).then(($discount) => {
                    const discount = parseFloat($discount[0].innerText.trim().slice(2))
                    expect(discount).to.equal(cartDiscount)
                })
            })
        })

        it('can find and order in the customer order history after having placed an order', () => {
            cy.visit(productLuma.simpleProductUrl)
            cy.get(selectorsLuma.addToCartButton).click()
            cy.wait(3000)
            Account.login(accountLuma.customer.customer.email, accountLuma.customer.password)
            cy.visit(checkoutLuma.checkoutUrl)
            cy.wait(5000)
            cy.get(selectorsLuma.addressSelected).should('exist')
            cy.get(selectorsLuma.checkoutBtn).click()
            cy.wait(4000)
            cy.get(selectorsLuma.moneyOrderPaymentMethodSelector).should('be.checked')
            cy.get(selectorsLuma.placeOrderBtn).click()
            cy.wait(7000)
            cy.get(selectorsLuma.orderConfirmationOrderNumber).then(($orderNr) => {
                const orderNr = $orderNr[0].innerText.trim()
                cy.log(orderNr)
                cy.visit(checkoutLuma.orderHistoryUrl)
                cy.wait(3000)
                cy.get(selectorsLuma.orderHistoryOrderNumber).then(($orderHistoryOrderNr) => {
                    const orderNrHistory = $orderHistoryOrderNr[0].innerText.trim()
                    cy.log(orderNrHistory)
                    expect(orderNr).to.be.equal(orderNrHistory)
                })
            })
        })
    })
}

// Hyva tests
if (Cypress.env('isHyva')) {
    describe('Checkout tests', () => {
        before(() => {
            cy.visit(productHyva.simpleProductUrl)
            cy.get(selectorsHyva.addToCartButton).click()
        })

        it.only('Can see the correct product price and shipping costs', () => {
            cy.get(selectorsHyva.productPrice).then(($PDPprice) => {
                expect(/\$\d+\.\d{2}/.test($PDPprice[0].innerText.trim())).to.be.true
                const PDPPrice = $PDPprice[0].innerText.trim()
                cy.visit(checkoutHyva.checkoutUrl)
                Checkout.enterShippingAddress(checkout.shippingAddress)
                cy.get('.justify-around > .btn').click()
                cy.get('.flex > .mt-2 > .inline-block').click()
                cy.get(selectorsHyva.checkoutSubtotalPrice).then(($checkoutPrice) => {
                    // The price has some form of "$12.32"
                    const checkoutPrice = $checkoutPrice[0].innerText.trim()
                    expect($checkoutPrice[0].innerText.trim()).to.equal(PDPPrice)
                    expect(/\$\d+\.\d{2}/.test($checkoutPrice[0].innerText.trim())).to.be.true
                    cy.get(selectorsHyva.checkoutShippingPrice).then(($shippingPrice) => {
                        const shippingPrice = $shippingPrice[0].innerText.trim()
                        expect(/\$\d+\.\d{2}/.test(shippingPrice)).to.be.true
                        cy.get('.mt-3 > .flex > :nth-child(2)').then(($totalPrice) => {
                            const totalPrice = $totalPrice[0].innerText.trim()
                            expect(/\$\d+\.\d{2}/.test(totalPrice)).to.be.true
                            expect(+checkoutPrice.slice(1) + (+shippingPrice.slice(1))).to.equal(+totalPrice.slice(1))
                        })
                    })
                })
            })
        })

        it('Can see coupon discount in checkout', () => {
            Checkout.addProductToCart(productHyva.couponProductUrl)
            Checkout.addCoupon(productHyva.couponCode)
            cy.get(selectorsHyva.cartSummeryDiscount).should('be.visible')
            cy.visit(checkoutHyva.checkoutUrl)
            cy.get(selectorsHyva.checkoutSubtotalPrice).then(($totalsPrice) => {
                const price = +$totalsPrice[0].innerText.match(/\d+\.\d\d/g)[0]
                cy.get(selectorsHyva.checkoutDiscountPrice).then(($discount) => {
                    const discount = +$discount[0].innerText.match(/\d+\.\d\d/g)[0]
                    cy.get(selectorsHyva.checkoutTotalPrice).then(($total) => {
                        const total = +$total[0].innerText.match(/\d+\.\d\d/g)[0]
                        expect(+total.toFixed(1)).to.equal(+(price - discount).toFixed(1))
                    })
                })
            })
        })

        it('can find and order in the customer order history after having placed an order', () => {
            Account.login(accountHyva.customer.customer.email, accountHyva.customer.password)
            cy.visit(checkoutHyva.checkoutUrl)
            cy.get(selectorsHyva.checkoutContainer).then(($checkout) => {
                // if customer has a default shipping address no new shipping address needs to be entered
                if (!$checkout[0].querySelectorAll(selectorsHyva.addressSelected).length) {
                    cy.get(selectorsHyva.addressSelected).should('not.exist')
                    Checkout.enterShippingAddress(checkoutHyva.shippingAddress)
                    cy.get(selectorsHyva.saveAddressBtn).click()
                }
                cy.get(selectorsHyva.addressSelected).should('exist')
                cy.get(selectorsHyva.shippingMethodField).click()
                cy.get(selectorsHyva.moneyOrderPaymentMethodSelector).click()
                cy.get(selectorsHyva.placeOrderBtn).click()
                cy.get(selectorsHyva.shippingAddressButtons).should('not.contain.text', 'Save')
                cy.get(selectorsHyva.orderConfirmationOrderNumber).then(($orderNr) => {
                    cy.visit(checkoutHyva.orderHistoryUrl)
                    cy.get(selectorsHyva.accountViewOrder).first().click()
                    cy.get(selectorsHyva.orderHistoryOrderNumber).then(($orderHistoryOrderNr) => {
                        cy.log($orderNr)
                        const orderNrRegex = /\d{9}/
                        const orderNr = $orderNr[0].innerText.match(orderNrRegex)[0]
                        const orderHistoryNr = $orderHistoryOrderNr[0].innerText.match(orderNrRegex)[0]
                        expect(orderNr).to.be.equal(orderHistoryNr)
                    })
                })
            })
        })
    })
}
