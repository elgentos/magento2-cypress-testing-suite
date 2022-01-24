import {Cart} from '../../page-objects/cart'

// Luma imports
import cartLuma from "../../fixtures/selectors/luma/cart"

// Hyva imports
import cartHyva from "../../fixtures/selectors/hyva/cart"

// Luma tests
if (Cypress.env('isLuma')) {
    describe('Isolated test for adding a product to the cart', () => {
        it('can add a product to the cart', () => {
            Cart.addProductToCart(cartLuma.url.product1Url)
            cy.get(cartLuma.product.messageToast).should('include.text', 'You added Didi Sport Watch to your shopping cart.').should('be.visible')
        })
    })

    describe('Cart tests', () => {
        beforeEach(() => {
            Cart.addProductToCart(cartLuma.url.product1Url)
            cy.visit(cartLuma.url.cartUrl)
            cy.wait(3000)
        })

        it('can change the quantity in the cart', () => {
            cy.get(cartLuma.qtyInputField).type('{backspace}2{enter}').should('have.value', '2')
        })

        it('can remove a product from the cart', () => {
            cy.get(cartLuma.deleteProductButton).click()
            cy.get(cartLuma.emptyCartTextField).should('include.text', 'You have no items in your shopping cart.').should('be.visible')
        })

        it('can add a coupon to the cart', () => {
            Cart.addProductToCart(cartLuma.url.product2Url)
            Cart.addCouponCode()
            cy.get(cartLuma.cartSummaryTable).should('include.text', 'Discount').should('be.visible')
        })

        it('cannot add a non existing coupon', () => {
            cy.get(cartLuma.couponDropdownSelector).click()
            cy.get(cartLuma.couponInputField).type('wrong coupon code')
            cy.get(cartLuma.addCouponButton).click()
            cy.get(cartLuma.messageToast).should('include.text', 'The coupon code "wrong coupon code" is not valid.').should('be.visible')
        })
    })
}

// Hyva tests
if (Cypress.env('isHyva')) {
    describe('Isolated test for adding a product to the cart', () => {
        it.only('can add a product to the cart', () => {
            Cart.addProductToCart(cartHyva.url.product1Url)
            cy.get(cartHyva.product.messageToast).should('include.text', 'to your shopping cart').should('be.visible')
        })
    })

    describe('Cart tests', () => {
        beforeEach(() => {
            Cart.addProductToCart(cartHyva.url.product1Url)
            cy.visit(cartHyva.url.cartUrl)
            cy.wait(3000)
        })

        it('can change the quantity in the cart', () => {
            cy.get(cartHyva.qtyInputField).type('{backspace}2{enter}').should('have.value', '2')
        })

        it('can remove a product from the cart', () => {
            cy.get(cartHyva.deleteProductButton).click()
            cy.get(cartHyva.emptyCartTextField).should('include.text', 'You have no items in your shopping cart.').should('be.visible')
        })

        it('can add a coupon to the cart', () => {
            Cart.addProductToCart(cartHyva.url.product2Url)
            Cart.addCouponCode()
            cy.get(cartHyva.cartSummaryTable).should('include.text', 'Coupons/Discounts').should('be.visible')
        })

        it('can delete an added coupon from the cart', () => {
            Cart.addProductToCart(cartHyva.url.product2Url)
            Cart.addCouponCode()
            cy.get(cartHyva.cartSummaryTable).should('include.text', 'Coupons/Discounts').should('not.be.visible')
        })

        it('cannot add a non existing coupon', () => {
            cy.get(cartHyva.couponDropdownSelector).click()
            cy.get(cartHyva.couponInputField).type('wrong coupon code')
            cy.get(cartHyva.addCouponButton).click()
            cy.get(cartHyva.messageToast).should('include.text', 'The coupon code isn\'t valid. Verify the code and try again.').should('be.visible')
        })

        it.only('displays the correct product prices and totals', () => {
            cy.visit(cartHyva.url.product1Url)

            //check if product price matches with price in cart
            cy.get(cartHyva.product.productPrice).then(($productPrice) => {
                const productPrice = $productPrice[0].textContent.trim()

                Cart.addProductToCart(cart.url.product2Url)
                cy.get(cart.product1Price).should('have.text', productPrice)

                //change the qty value
                cy.get(cartHyva.qtyInputField).eq(0).type('{backspace}2{enter}').then(($qty) => {
                    const qty = parseInt($qty.val())
                    cy.wait(3000)

                    //check if qty * product subtotal displays the correct amount
                    cy.get(cartHyva.product1Subtotal).then(($subTotal) => {
                        const subTotal = parseInt($subTotal[0].textContent.trim().slice(1))
                        expect(parseInt(productPrice.slice(1)) * qty).to.equal(subTotal)
                    })
                })
            })

            //check if the grand total is correct
            cy.get(cartHyva.product1Subtotal).then(($total1) => {
                const subTotal1 = parseInt($total1[0].textContent.trim().slice(1))

                cy.get(cartHyva.product2Subtotal).then(($total2) => {
                    const subTotal2 = parseInt($total2[0].textContent.trim().slice(1))

                    cy.get(cartHyva.grandTotal).then(($grandTotal) => {
                        const grandTotal = parseInt($grandTotal[0].textContent.trim().slice(1))
                        expect(grandTotal).to.equal(subTotal1 + subTotal2)
                    })
                })
            })
        })
    })
}
