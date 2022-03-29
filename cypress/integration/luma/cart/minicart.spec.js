import selectors from '../../../fixtures/luma/selectors/minicart'
import product from '../../../fixtures/luma/product'
import {Cart} from '../../../page-objects/luma/cart'
import {shouldHavePageTitle, shouldHaveSuccessMessage} from '../../../support/utils'

describe('Mini cart tests', () => {
    beforeEach(() => {
        cy.removeLocalStorage();
        cy.clearCookies();
        Cart.addProductToCart(product.simpleProductUrl);
        shouldHaveSuccessMessage(`You added ${product.simpleProductName} to your shopping cart.`)
        cy.get(selectors.miniCartButton).click()
    })

    it('Can delete an item from the cart slider', () => {
        cy.get(selectors.removeProductButton).click()
        cy.get('.action-primary').click()
    })

    it('Can navigates to the product when clicking the edit icon', () => {
        cy.get(selectors.miniCartProductName).then(($productName) => {
            const productName = $productName[0].textContent.trim()
            cy.get(selectors.miniCartEditProductButton).click()
            cy.get(selectors.PDPProductName).then(($productName2) => {
                const productName2 = $productName2[0].textContent.trim()
                expect(productName).to.equal(productName2)
            })
        })
    })

    it('Can navigate to the cart with a link in the mini-cart', () => {
        cy.get(selectors.miniCartViewCartLink).click()
        shouldHavePageTitle('Shopping Cart')
    })

    it('Can navigate to the checkout with a link in the slider', () => {
        cy.get(selectors.miniCartCheckoutButton).click()
        cy.url()
            .should('contain', 'checkout')
    })

    it('Can check if the items and prices in the slider are displayed correctly', () => {
        cy.get(selectors.productPrice).then(($productPrice) => {
            cy.get(selectors.miniCartButton).click()
            const productPrice = $productPrice[0].textContent.trim()
            cy.get(selectors.miniCartFirstProductPrice).then(($productPrice2MiniCart) => {
                const productPrice2MiniCart = $productPrice2MiniCart[0].textContent.trim()
                expect(productPrice).to.equal(productPrice2MiniCart)
                cy.get(selectors.firstProductAmount).invoke('data', 'item-qty').then(($qty) => {
                    const qty = $qty
                    cy.get(selectors.miniCartSubtotal).then(($total) => {
                        const total = parseFloat($total[0].textContent.trim().slice(1))
                        cy.get(selectors.miniCartFirstProductPrice).then(($productPriceMiniCart) => {
                            const productPriceMiniCart = $productPriceMiniCart[0].textContent.trim().slice(1)
                            console.log(productPriceMiniCart, '$productPriceMiniCart')
                            const subTotal = (parseFloat(productPriceMiniCart) * parseFloat(qty))
                            expect(subTotal).to.equal(total)
                        })
                    })
                })
            })
        })
    })
})
