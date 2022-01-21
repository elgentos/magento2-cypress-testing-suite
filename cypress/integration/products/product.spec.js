import product from "../../fixtures/product"
import account from "../../fixtures/account"
import selectors from "../../fixtures/selectors/luma/product"
import {Account} from "../../page-objects/account"
import {Product} from "../../page-objects/product";
import {Magento2RestApi} from '../../support/magento2-rest-api'

/**
 * For all these test to succeed there needs to be a product out of stock linked
 * in the fixture under the 'outOfStockProductUrl' key, and the 'simpleProductUrl'
 * product needs to be in stock
 */
describe('Simple Product test suite', () => {
    beforeEach(() => {
        cy.visit(product.simpleProductUrl)
        cy.wait(2000)
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
            .contains(`Sie haben ${product.simpleProductName} zu Ihrem Warenkorb hinzugefügt.`)
        // Requires a wait for the product count to update
        cy.wait(1000)
        cy.get('.showcart').click()
        cy.get(selectors.cartIconProductCount)
            .invoke('text').then(parseFloat)
            .should('be.gte', 1)
    })

    it('Can see breadcrumbs', () => {
        cy.get(selectors.breadCrumbItems)
            .should('have.length.gte', 2)
    })

    it('Can\'t add a product to a wishlist when the user in not logged in', () => {
        cy.get(selectors.addToWishlistButtonGuest).click()
        cy.wait(2000)
        cy.get(selectors.errorMessage)
            .should('exist')
            .should("contain.text", 'Sie müssen sich einloggen oder registrieren, um Produkte zu Ihrer Wunschliste hinzuzufügen.')
    })

    it('Can add a product to the wishlist when customer is logged in', () => {
        const customerMail = Date.now() + account.customer.customer.email
        cy.visit(account.routes.accountCreate)
        Account.createNewCustomer(account.customer.customer.firstname, account.customer.customer.lastname, customerMail, account.customer.password)
        cy.visit(Product.routes.simpleProduct)
        cy.wait(3000)
        cy.get(selectors.addToWishlistButton).click().then(() => {
            cy.wait(3000)
            cy.get(selectors.successMessage)
                .should('include.text', `${product.simpleProductName} wurde zu Ihrer Wunschliste hinzugefügt. Klicken Sie hier um weiter einzukaufen.`)
                .should('be.visible')
        })
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
            .should('contain.text', 'Fügen Sie Ihre Bewertung hinzu')
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
            .should('contain.text','Ihre Bewertung wurde zur Moderation übermittelt.')
    })

    it('Can see that a product is in stock', () => {
        // The productUrl should point to a product that is in stock
        cy.get(selectors.productStockMessage)
            .should('exist')
            .should('contain.text', 'Auf Lager')
    })

    it('Can increment the product quantity on the pdp', () => {
        cy.get(selectors.productQty)
            .type('{uparrow}')
            .should('have.value', '2')
    })
})

describe('Configurable products test suite', () => {
    beforeEach(() => {
        cy.visit(product.configurableProductUrl)
        cy.wait(1000)
    })

    it('can find products in the related products list', () => {
        // Configurable product has related products
        cy.get(selectors.relatedProductsTitle)
            .should('exist')
            .should('contain.text', 'Verwandte Produkte')
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
            .eq(0).find('div').first()
            .should('have.class', 'selected')
        cy.get(selectors.productAttributeSelector)
            .eq(1).find('div').first().click()
        cy.get(selectors.productAttributeSelector)
            .eq(1).find('div').first()
            .should('have.class', 'selected')
    })
})
