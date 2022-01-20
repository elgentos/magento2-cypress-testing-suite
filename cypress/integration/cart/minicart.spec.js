import minicart from "../../fixtures/minicart.json"
import selectors from "../../fixtures/selectors/hyva/minicart.json"

describe('Mini cart tests', () => {
    beforeEach(() => {
        cy.visit(minicart.didiSportWatch)
        cy.get(selectors.addToCartButton).click()
        cy.get(selectors.miniCartButton).click()
    })

    it('Can delete an item from the cart slider', () => {
        cy.get(selectors.removeProductButton).click()
        cy.contains('You removed the item.')
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

    it('can navigate to the cart with a link in the slider', () => {
        cy.get(selectors.miniCartViewCartLink).click()
        cy.get(selectors.pageTitle).should('contain.text','Shopping Cart').should('be.visible')
    })

    it('can navigate to the checkout with a link in the slider', () => {
        cy.get(selectors.miniCartCheckoutButton).click()
        cy.get(selectors.pageTitle).should('contains.text', 'Checkout').should('be.visible')
    })
})

describe('Test without added product',() => {
    it('Can check if the items and prices in the slider are displayed correctly', () => {
        cy.visit(minicart.waterBottle)
        cy.get(selectors.addToCartButton).click()
        cy.get(selectors.productPrice).then(($productPrice) => {
            cy.get(selectors.miniCartButton).click()
            const productPrice = $productPrice[0].textContent.trim().slice(1)
            cy.get(selectors.miniCartFirstProductPrice).then(($productPrice2MiniCart) => {
                const productPrice2MiniCart = $productPrice2MiniCart[0].textContent.trim().slice(1)
                expect(productPrice).to.equal(productPrice2MiniCart)
                cy.get(selectors.firstProductAmount).then(($qty) => {
                    const qty = $qty[0].textContent.trim()
                    cy.get(selectors.miniCartSubtotal).then(($total) => {
                        const total = parseInt($total[0].textContent.trim().slice(1))
                        cy.get(selectors.miniCartFirstProductPrice).then(($productPriceMiniCart) => {
                            const productPriceMiniCart = $productPriceMiniCart[0].textContent.trim().slice(1)
                            const subTotal = (productPriceMiniCart * qty)
                            expect(subTotal).to.equal(+total)
                        })
                    })
                })
            })
        })
    })
})
