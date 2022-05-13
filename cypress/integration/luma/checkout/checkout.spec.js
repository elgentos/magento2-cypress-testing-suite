import {Checkout} from '../../../page-objects/luma/checkout'
import {Account} from '../../../page-objects/luma/account'
import account from '../../../fixtures/account'
import product from '../../../fixtures/luma/product'
import checkout from '../../../fixtures/checkout'
import selectors from '../../../fixtures/luma/selectors/checkout'
import {isMobile, shouldHavePageTitle, shouldHaveSuccessMessage} from '../../../support/utils'
import {Cart} from '../../../page-objects/luma/cart'
import {Magento2RestApi} from '../../../support/magento2-rest-api'
import cartLuma from '../../../fixtures/luma/selectors/cart'
import productLuma from '../../../fixtures/luma/product'
import minicart from '../../../fixtures/luma/selectors/minicart'
import global from '../../../fixtures/globalSelectors'

function setupGuestCheckoutInterceptors() {
    cy.intercept('**/customer/section/load/?sections=*')
        .as('sectionLoad')
    cy.intercept('**/rest/*/V1/guest-carts/*/estimate-shipping-methods')
        .as('estimateShipping')
    cy.intercept('**/rest/*/V1/guest-carts/*/totals-information')
        .as('totalsInformation')
    cy.intercept('**/rest/*/V1/customers/isEmailAvailable')
        .as('emailAvailable')
    cy.intercept('**/rest/*/V1/guest-carts/*/payment-information')
        .as('paymentInformation')
}

function chooseMoneyOrderPaymentAndPlaceOrder(wait = '@estimateShipping') {
    if(wait !== null) {
        cy.wait(wait)
    }
    cy.get(selectors.checkoutBtn).click()
    cy.get(selectors.moneyOrderPaymentMethodSelector).check({force: true})
    cy.get(selectors.moneyOrderPaymentMethodSelector).should('be.checked')
}

function addProductToCartAndVerifyItWasAdded() {
    Cart.addProductToCart(product.simpleProductUrl)
    cy.wait('@sectionLoad')
    shouldHaveSuccessMessage(`You added ${product.simpleProductName} to your shopping cart.`)
}

function addAProductToCartAndEnterBillingAddressInCheckout() {
    Cart.addProductToCart(product.simpleProductUrl)
    cy.wait('@sectionLoad')
    shouldHaveSuccessMessage(`You added ${product.simpleProductName} to your shopping cart.`)
    cy.get(minicart.miniCartButton)
        .click()
    cy.get(minicart.miniCartViewCartLink)
        .click()
    cy.url()
        .should('contain', checkout.cartUrl)
    cy.wait('@estimateShipping')
    cy.get(selectors.proceedToCheckout)
        .click()

    cy.wait('@estimateShipping')
    Checkout.enterShippingAddress(checkout.shippingAddress)
}

describe('Checkout tests', () => {
    beforeEach(() => {
        Account.ensureLoggedOut()
    })

    it('Can see the correct product price and shipping costs', () => {
        setupGuestCheckoutInterceptors()
        cy.intercept('**/rest/*/V1/carts/mine/shipping-information')
            .as('shippingInformation')

        Cart.addProductToCart(product.simpleProductUrl)
        cy.wait('@sectionLoad')

        cy.get(selectors.productPrice).then(($PDPprice) => {
            expect($PDPprice).to.be.contain(product.currency)
            const PDPPrice = $PDPprice[0].innerText.trim()

            cy.visit(checkout.checkoutUrl)
            cy.wait('@estimateShipping')
            Checkout.enterShippingAddress(checkout.shippingAddress)
            cy.wait('@estimateShipping')
            cy.get('.table-checkout-shipping-method td')
                .contains('Fixed')
                .click()
            cy.get('.button.action.continue.primary').click()
            cy.wait('@sectionLoad')

            if (isMobile()) {
                cy.get('.action.showcart').click()
            }

            cy.get(selectors.checkoutPrice).then(($checkoutPrice) => {
                const checkoutPrice = $checkoutPrice[0].innerText.trim()
                expect($checkoutPrice[0].innerText.trim()).to.equal(PDPPrice)
                cy.get(selectors.checkoutShippingPrice).then(($shippingPrice) => {
                    const shippingPrice = $shippingPrice[0].innerText.trim()
                    cy.get(selectors.totalPrice).then(($totalPrice) => {
                        const totalPrice = $totalPrice[0].innerText.trim()
                        // Uncomment if your shop has taxes
                        // cy.get(selectors.taxesPrice).then($taxesPrice => {
                        //     const taxes = $taxesPrice[0].innerText.trim().slice(1)
                        //     expect(parseFloat(checkoutPrice.slice(1)) + parseFloat(shippingPrice.slice(1)) + parseFloat(taxes)).to.equal(parseFloat(totalPrice))
                        // })
                        expect(parseFloat(checkoutPrice) + parseFloat(shippingPrice)).to.equal(parseFloat(totalPrice))
                    })
                })
            })
        })
    })

    it('Can see coupon discount in checkout', () => {
        setupGuestCheckoutInterceptors()

        Cart.addProductToCart(productLuma.simpleProductUrl)
        cy.visit(cartLuma.cartUrl)
        cy.wait('@estimateShipping')

        Magento2RestApi.createRandomCouponCode()
            .then(coupon => {
                Cart.addCouponCode(coupon)
                cy.wait('@estimateShipping')
                cy.wait('@sectionLoad')
                cy.get(cartLuma.cartSummaryTable)
                    .should('include.text', 'Discount')
                    .should('be.visible')
                // The discount is applied to the shipping as well. Because of that it changes after the
                // shipping information is loaded and parsed. To make sure we're grabbing the right discount
                // amount we wait until that's done.
                cy.get(selectors.shippingTotal)
                    .should('not.contain', '0,00')
                cy.get(selectors.cartDiscount).then(($cartDiscount) => {
                    const cartDiscount = parseFloat($cartDiscount[0].innerText.trim().slice(1).replace(',', '.'))
                    cy.visit(checkout.checkoutUrl)
                    cy.wait('@estimateShipping')
                    Checkout.enterShippingAddress(checkout.shippingAddress)
                    cy.get('.button.action.continue.primary').click()
                    cy.wait('@sectionLoad')
                    cy.wait('@sectionLoad')
                    if (isMobile()) {
                        cy.get('.action.showcart').click()
                    }
                    cy.get(selectors.checkoutDiscountPrice).then(($discount) => {
                        console.log($discount[0].innerText.trim().slice(1))
                        const discount = parseFloat($discount[0].innerText.trim().slice(1).replace(',', '.'))
                        expect(discount).to.equal(cartDiscount)
                    })
                })
            })
    })

    it('Can find and order in the customer order history after having placed an order', () => {
        setupGuestCheckoutInterceptors()
        cy.intercept('**/rest/*/V1/carts/mine/shipping-information')
            .as('shippingInformation')
        cy.intercept('**/rest/*/V1/carts/mine/payment-information')
            .as('paymentInformation')
        cy.intercept('**/rest/default/V1/carts/mine/estimate-shipping-methods-by-address-id')
            .as('estimateShippingByAddressId')

        Cart.addProductToCart(product.simpleProductUrl)
        cy.wait('@sectionLoad')
        shouldHaveSuccessMessage(`You added ${product.simpleProductName} to your shopping cart.`)
        Account.login(account.customer.customer.email, account.customer.password)
        Account.createAddress(account.customerInfo)

        cy.visit(checkout.checkoutUrl)
        cy.wait('@sectionLoad')
        cy.get(selectors.addressSelected).should('exist')

        chooseMoneyOrderPaymentAndPlaceOrder('@estimateShippingByAddressId')
        cy.get(selectors.placeOrderBtn)
            .last()
            .should('be.visible')
            .click()
        cy.wait('@paymentInformation')

        cy.get(selectors.orderConfirmationOrderNumber).then(($orderNr) => {
            const orderNr = $orderNr[0].innerText.trim()
            cy.visit(checkout.orderHistoryUrl)
            shouldHavePageTitle('My Orders')
            cy.get(selectors.orderHistoryOrderNumber).then(($orderHistoryOrderNr) => {
                const orderNrHistory = $orderHistoryOrderNr[0].innerText.trim()
                cy.log(orderNrHistory)
                expect(orderNr).to.be.equal(orderNrHistory)
            })
        })
    })

    it('Can do a checkout as guest', () => {
        setupGuestCheckoutInterceptors()

        addAProductToCartAndEnterBillingAddressInCheckout()

        chooseMoneyOrderPaymentAndPlaceOrder()
        cy.get(selectors.placeOrderBtn)
            .last()
            .should('be.visible')
            .click()
        cy.wait('@paymentInformation')

        cy.get(selectors.checkoutSuccess)
            .should('contain.text', 'Your order # is:')
    })

    it('Can do a checkout as guest with a different shipping address', () => {
        setupGuestCheckoutInterceptors()

        addAProductToCartAndEnterBillingAddressInCheckout()

        cy.wait('@estimateShipping')
        cy.get(selectors.checkoutBtn).click()
        cy.get(selectors.sameBillingAsShipping)
            .click()
        Checkout.enterBillingAddress(checkout.shippingAddress, false)

        cy.get(selectors.updateBillingAddress)
            .click()

        cy.get('.shipping-information .ship-to .shipping-information-content')
            .should('contain.text', checkout.shippingAddress.firstname)
            .should('contain.text', checkout.shippingAddress.lastname)
            .should('contain.text', checkout.shippingAddress.street)
            .should('contain.text', checkout.shippingAddress.city)

        cy.get(selectors.placeOrderBtn)
            .last()
            .should('be.visible')
            .click()
        cy.wait('@paymentInformation')

        cy.get(selectors.checkoutSuccess)
            .should('contain.text', 'Your order # is:')
    })

    describe('Validate email address in checkout', () => {
        beforeEach(() => {
            setupGuestCheckoutInterceptors()

            addProductToCartAndVerifyItWasAdded()

            cy.visit(checkout.checkoutUrl)
            cy.wait('@estimateShipping')
        })

        it('Enters a correct email address', () => {
            cy.get(`${selectors.customerEmailFieldset} ${selectors.customerEmailField}`)
                .type('john.doe@example.com')
        })

        it('Enters an incorrect email address', () => {
            cy.get(`${selectors.customerEmailFieldset} ${selectors.customerEmailField}`)
                .type('John')
                .blur()
            cy.get(selectors.emailValidationErrorField)
                .should('contain.text', 'Please enter a valid email address')
        })

        it('Enters another incorrect email address', () => {
            cy.get(`${selectors.customerEmailFieldset} ${selectors.customerEmailField}`)
                .type('john.doe#example.com')
                .blur()
            cy.get(selectors.emailValidationErrorField)
                .should('contain.text', 'Please enter a valid email address')
        })
    })
})
