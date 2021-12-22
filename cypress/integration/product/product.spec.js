import product from "../../fixtures/product"
import account from "../../fixtures/account"
import selectors from "../../fixtures/selectors/hyva/product"
import {Account} from "../../page-objects/account"
import {Product} from "../../page-objects/product";
import {Magento2RestApi} from '../../support/magento2-rest-api'

describe('Simple Product test suite', () => {
    beforeEach(() => {
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
        cy.get(selectors.successMessage)
            .contains(`You added ${product.simpleProductName} to your shopping cart.`)
        // Requires a wait for the product count to update
        cy.wait(1000)
        cy.get(selectors.cartIconProductCount)
            .invoke('text').then(parseFloat)
            .should('be.gte', 1)
    })

    it('Can see breadcrumbs', () => {
        cy.get(selectors.breadCrumbItems)
            .should('have.length.gte', 2)
    })


    it('Can\'t add a product to a wishlist when the user in not logged in', () => {
        cy.get(selectors.addToWishlistButton).click()
        cy.get(selectors.errorMessage)
            .should('exist')
            .should("contain.text", 'You must login or register to add items to your wishlist.')
    })

    it('Can add a product to the wishlist when customer is logged in', () => {
        const customerMail = Date.now() + account.customer.customer.email
        cy.visit(Account.routes.accountCreateRoute)
        Account.createNewCustomer(account.customer.customer.firstname, account.customer.customer.lastname, customerMail, account.customer.password)
        cy.visit(Product.routes.simpleProduct)
        cy.get(selectors.addToWishlistButton).click().then(() => {
            cy.get(selectors.successMessage)
                .should('include.text', `${product.simpleProductName} has been added to your Wish List.`)
                .should('be.visible')
        })
    })

    it('Can see product review score and the individual reviews', () => {
        cy.get(selectors.productRatingStar)
            .should('have.length', 5)
        cy.get(selectors.customerReviewTitle)
            .should('exist')
            .should('include.text','Customer Reviews')
        cy.get(selectors.productCustomerReviews)
            .should('have.length.gte', 1)
    })

    it('Can add reviews to a product', () => {
        cy.get(selectors.productCustomerReviewWriteTitle)
            .should('exist')
            .should('contain.text', 'Write Your Own Review')
        cy.get(selectors.reviewReviewerNameField).type('Someone')
            .should('have.value', 'Someone')
        cy.get(selectors.reviewSummeryField).type('Something')
            .should('have.value', 'Something')
        cy.get(selectors.reviewReviewField).type('Longer something')
            .should('have.value', 'Longer something')
        cy.get(selectors.reviewFiveStarScore).click()
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

    /* This test requires that there is an cypress.env.json with an admin token  */
    it('Can\'t add an out of stock product to the cart', () => {
        Magento2RestApi.updateProductQty(product.outOfStockProductSku, 0)
        cy.visit(product.outOfStockProductUrl)
        cy.get(selectors.productStockMessage)
            .should('exist')
            .should('contain.text', 'Out of stock')
        cy.get(selectors.addToCartButton)
            .should('not.exist')
    })

    it('Can increment the product quantity on the pdp', () => {
        cy.get(selectors.productQty)
            .type('{uparrow}')
            .should('have.value', '2')
    })
})

describe('Configurable products test suite', () => {
    beforeEach(() => {
        cy.visit(Product.routes.configurableProduct)
    })

    it('can find products in the related products list', () => {
        // Configurable product has related products
        cy.get(selectors.relatedProductsTitle)
            .should('exist')
            .should('contain.text', 'Related Products')
        cy.get(selectors.relatedProductsCard)
            .should('have.length.gte', 3)
    })

    it('Can\'t add a configurable product to the cart when no configuration is selected', () => {
        cy.get(selectors.addToCartButton)
            .click()
        // The html5 form validation gives the form a pseudo class of invalid if a required option was forgotten
        cy.get(selectors.forgottenField)
            .should('exist')
    })

    it('Can select product attributes', () => {
        cy.get(selectors.productAttributeSelector)
            .eq(0).find('div').first().click()
        cy.get(selectors.productAttributeSelector)
            .eq(0).find('input').first()
            .should('be.checked')
        cy.get(selectors.productAttributeSelector)
            .eq(1).find('div').first().click()
        cy.get(selectors.productAttributeSelector)
            .eq(1).find('input').first()
            .should('be.checked')
    })
})
