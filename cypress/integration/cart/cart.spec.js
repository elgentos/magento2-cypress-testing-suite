import cart from "../../fixtures/selectors/luma/cart.json"
import {Cart} from '../../page-objects/cart'

describe('Isolated test for adding a product to the cart', () => {
    it('can add a product to the cart', () => {
        Cart.addProductToCart(cart.url.product1Url)
        cy.get(cart.product.messageToast).should('include.text', 'zu Ihrem Warenkorb hinzugefügt.').should('be.visible')
    })
})

describe('Cart tests', () => {
    beforeEach(() => {
        Cart.addProductToCart(cart.url.product1Url)
        cy.wait(3000)
        cy.visit(cart.url.cartUrl)
        cy.wait(3000)
    })

    it('can change the quantity in the cart', () => {
        cy.get(cart.qtyInputField).type('{backspace}2{enter}').should('have.value', '2')
    })

    it('can remove a product from the cart', () => {
        cy.get(cart.deleteProductButton).click()
        cy.get(cart.emptyCartTextField).should('include.text', 'Sie haben keine Artikel in Ihrem Warenkorb.').should('be.visible')
    })

    it('can add a coupon to the cart', () => {
        Cart.addProductToCart(cart.url.product2Url)
        Cart.addCouponCode()
        cy.get(cart.cartSummaryTable).should('include.text', 'Rabatt').should('be.visible')
    })

    it('cannot add a non existing coupon', () => {
        cy.get(cart.couponDropdownSelector).click()
        cy.get(cart.couponInputField).type('wrong coupon code')
        cy.get(cart.addCouponButton).click()
        cy.get(cart.messageToast).should('include.text', 'Der Gutschein-Code "wrong coupon code" ist ungültig.').should('be.visible')
    })
})

