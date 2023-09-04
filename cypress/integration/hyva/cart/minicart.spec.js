import minicart from "../../../fixtures/minicart"
import selectors from "../../../fixtures/hyva/selectors/minicart"

describe('Mini cart tests', () => {
    beforeEach(() => {
        cy.visit(minicart.didiSportWatch)
        cy.get(selectors.addToCartButton).click()
        cy.get(selectors.miniCartButton).click()
        cy.wait(250) // wait for slider to open
    })

    it('Can delete an item from the cart slider', () => {
        cy.get(selectors.removeProductButton).click()
        cy.contains('You removed the item.')
    })

    it('Can navigate to the product when clicking the edit icon', () => {
        cy.get(selectors.miniCartProductName).then(($productName) => {
            const productName = $productName[0].textContent.trim()
            cy.get(selectors.miniCartEditProductButton).click()
            cy.get(selectors.PDPProductName).then(($productName2) => {
                const productName2 = $productName2[0].textContent.trim()
                expect(productName).to.equal(productName2)
            })
        })
    })

    it('Can navigate to the cart with a link in the slider', () => {
        cy.get(selectors.miniCartViewCartLink).click()
        cy.get(selectors.pageTitle).should('contain.text','Shopping Cart').should('be.visible')
    })

    it('Can navigate to the checkout with a link in the slider', () => {
        cy.get(selectors.miniCartCheckoutButton).click()
        cy.title().should('eq', 'Checkout')
    })

    it('Can open minicart slider', () => {
        cy.get(selectors.miniCartSlider).should('be.visible')
    })

    it(["minicart"], 'Can change quantity in the minicart', () => {
        let min = Math.ceil(3);
        let max = Math.floor(33);
        let newQuantity = Math.floor(Math.random() * (max - min) + min);

        cy.get(selectors.miniCartEditProductButton).click();
        cy.get(selectors.qtyInputField)
          .clear()
          .type(newQuantity.toString())
          .should("have.value", newQuantity.toString());
        cy.get(selectors.addToCartButton).click()
        cy.get(selectors.miniCartButton).click()
        cy.get(selectors.productQty)
          .should('have.text', newQuantity.toString())
    })
})

describe('Test without added product',() => {
    it('Can check if the items and prices in the slider are displayed correctly', () => {
        cy.visit(minicart.waterBottle)
        cy.get(selectors.addToCartButton).click()
        cy.get(selectors.productPrice).then(($productPrice) => {
            cy.get(selectors.miniCartButton).click()
            cy.wait(250) // wait for slider to open
            const productPrice = $productPrice[0].textContent.trim().slice(1)
            cy.get(selectors.miniCartProductPrice).first().then(($productPrice2MiniCart) => {
                const productPrice2MiniCart = $productPrice2MiniCart[0].textContent.trim().slice(1)
                expect(productPrice).to.equal(productPrice2MiniCart)
                cy.get(selectors.firstProductAmount).then(($qty) => {
                    const qty = $qty[0].textContent.trim()
                    cy.get(selectors.miniCartSubtotal).then(($total) => {
                        const total = parseInt($total[0].textContent.trim().slice(1))
                        cy.get(selectors.miniCartProductPrice).first().then(($productPriceMiniCart) => {
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
