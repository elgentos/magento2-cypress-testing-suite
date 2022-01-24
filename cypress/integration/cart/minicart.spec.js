// Luma imports
import minicartLuma from "../../fixtures/luma/minicart"
import selectorsLuma from "../../fixtures/selectors/luma/minicart"

// Hyva imports
import minicartHyva from "../../fixtures/hyva/minicart"
import selectorsHyva from "../../fixtures/selectors/hyva/minicart"

// Luma tests
if (Cypress.env('isLuma')) {
    describe('Mini cart tests', () => {
        beforeEach(() => {
            cy.visit(minicartLuma.didiSportWatch)
            cy.get(selectorsLuma.addToCartButton).click()
            cy.wait(5000)
            cy.get(selectorsLuma.miniCartButton).click()
            cy.wait(2000)
        })

        it('Can delete an item from the cart slider', () => {
            cy.get(selectorsLuma.removeProductButton).click()
            cy.get('.action-primary').click()
        })

        it('Can navigates to the product when clicking the edit icon', () => {
            cy.get(selectorsLuma.miniCartProductName).then(($productName) => {
                const productName = $productName[0].textContent.trim()
                cy.get(selectorsLuma.miniCartEditProductButton).click()
                cy.get(selectorsLuma.PDPProductName).then(($productName2) => {
                    const productName2 = $productName2[0].textContent.trim()
                    expect(productName).to.equal(productName2)
                })
            })
        })

        it('can navigate to the cart with a link in the mini-cart', () => {
            cy.get(selectorsLuma.miniCartViewCartLink).click()
            cy.get(selectorsLuma.pageTitle).should('contain.text', 'Shopping Cart').should('be.visible')
        })

        it('can navigate to the checkout with a link in the slider', () => {
            cy.get(selectorsLuma.miniCartCheckoutButton).click()
            cy.url().should('contain', 'checkout')
        })
    })

    describe('Test without added product', () => {
        it('Can check if the items and prices in the slider are displayed correctly', () => {
            cy.visit(minicartLuma.waterBottle)
            cy.get(selectorsLuma.addToCartButton).click()
            cy.wait(5000)
            cy.get(selectorsLuma.productPrice).then(($productPrice) => {
                cy.get(selectorsLuma.miniCartButton).click()
                const productPrice = $productPrice[0].textContent.trim()
                cy.get(selectorsLuma.miniCartFirstProductPrice).then(($productPrice2MiniCart) => {
                    const productPrice2MiniCart = $productPrice2MiniCart[0].textContent.trim()
                    expect(productPrice).to.equal(productPrice2MiniCart)
                    cy.get(selectorsLuma.firstProductAmount).invoke('data', 'item-qty').then(($qty) => {
                        const qty = $qty
                        cy.get(selectorsLuma.miniCartSubtotal).then(($total) => {
                            const total = parseInt($total[0].textContent.trim().slice(1))
                            cy.get(selectorsLuma.miniCartFirstProductPrice).then(($productPriceMiniCart) => {
                                const productPriceMiniCart = $productPriceMiniCart[0].textContent.trim().slice(1)
                                console.log(productPriceMiniCart, '$productPriceMiniCart')
                                const subTotal = (parseFloat(productPriceMiniCart) * parseFloat(qty))
                                cy.log(subTotal)
                                expect(subTotal).to.equal(total)
                            })
                        })
                    })
                })
            })
        })
    })
}

// Hyva tests
if (Cypress.env('isHyva')) {
    describe('Mini cart tests', () => {
        beforeEach(() => {
            cy.visit(minicartHyva.didiSportWatch)
            cy.get(selectorsHyva.addToCartButton).click()
            cy.get(selectorsHyva.miniCartButton).click()
        })

        it('Can delete an item from the cart slider', () => {
            cy.get(selectorsHyva.removeProductButton).click()
            cy.contains('You removed the item.')
        })

        it('Can navigates to the product when clicking the edit icon', () => {
            cy.get(selectorsHyva.miniCartProductName).then(($productName) => {
                const productName = $productName[0].textContent.trim()
                cy.get(selectorsHyva.miniCartEditProductButton).click()
                cy.get(selectorsHyva.PDPProductName).then(($productName2) => {
                    const productName2 = $productName2[0].textContent.trim()
                    expect(productName).to.equal(productName2)
                })
            })
        })

        it('can navigate to the cart with a link in the slider', () => {
            cy.get(selectorsHyva.miniCartViewCartLink).click()
            cy.get(selectorsHyva.pageTitle).should('contain.text','Shopping Cart').should('be.visible')
        })

        it('can navigate to the checkout with a link in the slider', () => {
            cy.get(selectorsHyva.miniCartCheckoutButton).click()
            cy.get(selectorsHyva.pageTitle).should('contains.text', 'Checkout').should('be.visible')
        })
    })

    describe('Test without added product',() => {
        it('Can check if the items and prices in the slider are displayed correctly', () => {
            cy.visit(minicartHyva.waterBottle)
            cy.get(selectorsHyva.addToCartButton).click()
            cy.get(selectorsHyva.productPrice).then(($productPrice) => {
                cy.get(selectorsHyva.miniCartButton).click()
                const productPrice = $productPrice[0].textContent.trim().slice(1)
                cy.get(selectorsHyva.miniCartFirstProductPrice).then(($productPrice2MiniCart) => {
                    const productPrice2MiniCart = $productPrice2MiniCart[0].textContent.trim().slice(1)
                    expect(productPrice).to.equal(productPrice2MiniCart)
                    cy.get(selectorsHyva.firstProductAmount).then(($qty) => {
                        const qty = $qty[0].textContent.trim()
                        cy.get(selectorsHyva.miniCartSubtotal).then(($total) => {
                            const total = parseInt($total[0].textContent.trim().slice(1))
                            cy.get(selectorsHyva.miniCartFirstProductPrice).then(($productPriceMiniCart) => {
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
}
