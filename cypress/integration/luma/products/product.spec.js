import product from '../../../fixtures/luma/product'
import selectors from '../../../fixtures/luma/selectors/product'
import checkout from '../../../fixtures/checkout'
import {shouldHaveErrorMessage, shouldHaveSuccessMessage} from '../../../support/utils'

describe('Simple Product test suite', () => {
    beforeEach(() => {
        cy.intercept('**/customer/section/load/?sections=*')
            .as('loadSections')
        cy.visit(product.simpleProductUrl)
    })

    it('Can see a title and image for the product', () => {
        cy.get(selectors.productTitle)
            .should('contain.text', product.simpleProductName)
            .should('be.visible')
        cy.get(selectors.productImage)
            .should('have.attr', 'src')
            .should('include', 'media/catalog/product')
    })

    it('Can see a price for the product', () => {
        cy.get(selectors.productPrice)
            .should('contain', product.currency)
            .then(($price) => {
                // Still unsure about this but can't think of a cypress way to test this
                const bool = (new RegExp(product.priceRegexp)).test($price[0].innerText)
                expect(bool).to.be.true
            })
    })

    it('Can add a product to the cart from the product page', () => {
        cy.get(selectors.addToCartButton).click()
        shouldHaveSuccessMessage(`You added ${product.simpleProductName} to your shopping cart.`)
        // Requires a wait for the product count to update
        cy.wait(1000)
        cy.get('.showcart').click()
        cy.wait(2000)
        cy.get(selectors.cartIconProductCount)
            .invoke('text')
            .then(($price) => {
                const price = parseFloat($price.slice(1))
                expect(price).to.be.gte(1)
            })

    })

    it.skip('Can see breadcrumbs', () => {
        cy.get(selectors.breadCrumbItems)
            .should('have.length.gte', 2)
    })

    it('Can\'t add a product to a wishlist when the user in not logged in', () => {
        cy.wait(1000)
        cy.get(selectors.addToWishlistButtonGuest)
            .first()
            .click()
        shouldHaveErrorMessage('You must login or register to add items to your wishlist.')
    })

    it('Can see product review score and the individual reviews', () => {
        cy.get(selectors.productRatingStar)
            .should('have.length', 1)
        cy.get(selectors.customerReviewView)
            .should('exist')
            .should('be.visible')
        cy.get(selectors.productCustomerReviews)
            .should('exist')
            .should('be.visible')
    })

    it('Can add reviews to a product', () => {
        cy.get(selectors.productCustomerReviews)
            .should('exist')
            .should('contain.text', 'Add Your Review')
            .click()
        cy.wait(1000)
        cy.get(selectors.reviewReviewerNameField).type('Someone')
        // .should('have.value', 'Someone')
        cy.wait(1000)
        cy.get(selectors.reviewSummeryField).type('Something')
        // .should('have.value', 'Something')
        cy.wait(1000)
        cy.get(selectors.reviewReviewField).type('Longer something')
        // .should('have.value', 'Longer something')
        cy.wait(1000)
        cy.get(selectors.reviewFiveStarScore).click({force: true})
        cy.get(selectors.reviewFifthStarInput)
            .should('be.checked')
        cy.get(selectors.reviewSubmitButton).click()
        cy.get(selectors.reviewSubmittedSuccessMessage)
            .should('exist')
            .should('contain.text','You submitted your review for moderation.')
    })

    it('Can see that a product is in stock', () => {
        // The productUrl should point to a product that is in stock
        cy.get(selectors.productStockMessage)
            .should('exist')
            .should('contain.text', 'In stock')
    })

    it('Can increment the product quantity on the product detail page', () => {
        cy.get(selectors.productQty)
            .type('{uparrow}')
            .should('have.value', '2')
    })

    // No related products in sample data
    it.skip('Can find products in the related products list', () => {
        cy.get(selectors.relatedProductsTitle)
            .should('exist')
            .should('contain.text', 'Related Products')
        cy.get(selectors.relatedProductsCard)
            .should('have.length.gte', 3)
    })
})

describe('Configurable products test suite', () => {
    beforeEach(() => {
        cy.intercept('**/customer/section/load/?sections=*')
            .as('loadSections')
        cy.visit(product.configurableProductUrl)
    })

    it('Can\'t add a configurable product to the cart when no configuration is selected', () => {
        cy.get(selectors.addToCartButton)
            .click()
        cy.get(selectors.forgottenField)
            .should('exist')
    })

    it('Can select swatch product attributes', () => {
        cy.get(selectors.productAttributeSelector)
            .eq(0).find('div').first().click()
        cy.get(selectors.productAttributeSelector)
            .eq(0).find('div').first()
            .should('have.class', 'selected')
        cy.get(selectors.productAttributeSelector)
            .eq(1).find('div').first().click()
        cy.get(selectors.productAttributeSelector)
            .eq(1).find('div').first()
            .should('have.class', 'selected')
    })

    // No selectable product option in sample data
    it.skip('Can select product options', () => {
        cy.get('#product-options-wrapper .field.configurable select')
            .first()
            .select(product.configurableOption)
        cy.get(selectors.addToCartButton).click()
        shouldHaveSuccessMessage(`You added ${product.configurableProductName} to your shopping cart.`)
        cy.visit(checkout.cartUrl)
        cy.get('#shopping-cart-table')
            .should('contain.text', product.configurableOption)
    })
})
