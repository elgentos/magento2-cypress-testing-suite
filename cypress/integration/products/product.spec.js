import {Account} from "../../page-objects/account"
import {Product} from "../../page-objects/product";
import {Magento2RestApi} from '../../support/magento2-rest-api'

// Luma imports
import productLuma from "../../fixtures/luma/product"
import accountLuma from "../../fixtures/luma/account"
import selectorsLuma from "../../fixtures/selectors/luma/product"

// Hyva imports
import productHyva from "../../fixtures/hyva/product"
import accountHyva from "../../fixtures/hyva/account"
import selectorsHyva from "../../fixtures/selectors/hyva/product"

// Luma tests
if (Cypress.env('isLuma')) {
    describe('Simple Product test suite', () => {
        beforeEach(() => {
            cy.visit(productLuma.simpleProductUrl)
            cy.wait(2000)
        })

        it('Can see a title and image for the product', () => {
            cy.get(selectorsLuma.productTitle)
                .should('contain.text', productLuma.simpleProductName)
                .should('be.visible')
            cy.get(selectorsLuma.productImage)
                .should('have.attr', 'src')
                .should('include', 'media/catalog/product')
        })

        it('Can see a price for the product', () => {
            cy.get(selectorsLuma.productPrice)
                .should('contain', productLuma.currency)
                .then(($price) => {
                    // Still unsure about this but can't think of a cypress way to test this
                    const bool = (new RegExp(productLuma.priceRegexp)).test($price[0].innerText)
                    expect(bool).to.be.true
                })
        })

        it('Can add a product to the cart from the product page', () => {
            cy.get(selectorsLuma.addToCartButton).click()
            cy.get(selectorsLuma.successMessage)
                .contains(`You added ${productLuma.simpleProductName} to your shopping cart.`)
            // Requires a wait for the product count to update
            cy.wait(1000)
            cy.get('.showcart').click()
            cy.wait(2000)
            cy.get(selectorsLuma.cartIconProductCount)
                .invoke('text')
                .then(($price) => {
                    const price = parseFloat($price.slice(1))
                    expect(price).to.be.gte(1)
                })

        })

        it('Can see breadcrumbs', () => {
            cy.get(selectorsLuma.breadCrumbItems)
                .should('have.length.gte', 2)
        })

        it('Can\'t add a product to a wishlist when the user in not logged in', () => {
            cy.get(selectorsLuma.addToWishlistButtonGuest).click()
            cy.wait(2000)
            cy.get(selectorsLuma.errorMessage)
                .should('exist')
                .should("contain.text", 'You must login or register to add items to your wishlist.')
        })

        it('Can add a product to the wishlist when customer is logged in', () => {
            const customerMail = Date.now() + accountLuma.customer.customer.email
            cy.visit(accountLuma.routes.accountCreate)
            Account.createNewCustomer(accountLuma.customer.customer.firstname, accountLuma.customer.customer.lastname, customerMail, accountLuma.customer.password)
            cy.visit(Product.routes.simpleProduct)
            cy.wait(3000)
            cy.get(selectorsLuma.addToWishlistButton).click().then(() => {
                cy.wait(3000)
                cy.get(selectorsLuma.successMessage)
                    .should('include.text', `${productLuma.simpleProductName} has been added to your Wish List.`)
                    .should('be.visible')
            })
        })

        it('Can see product review score and the individual reviews', () => {
            cy.get(selectorsLuma.productRatingStar)
                .should('have.length', 1)
            cy.get(selectorsLuma.customerReviewView)
                .should('exist')
                .should('be.visible')
            cy.get(selectorsLuma.productCustomerReviews)
                .should('exist')
                .should('be.visible')
        })

        it('Can add reviews to a product', () => {
            cy.get(selectorsLuma.productCustomerReviews)
                .should('exist')
                .should('contain.text', 'Add Your Review')
                .click()
            cy.wait(1000)
            cy.get(selectorsLuma.reviewReviewerNameField).type('Someone')
            // .should('have.value', 'Someone')
            cy.wait(1000)
            cy.get(selectorsLuma.reviewSummeryField).type('Something')
            // .should('have.value', 'Something')
            cy.wait(1000)
            cy.get(selectorsLuma.reviewReviewField).type('Longer something')
            // .should('have.value', 'Longer something')
            cy.wait(1000)
            cy.get(selectorsLuma.reviewFiveStarScore).click({force: true})
            cy.get(selectorsLuma.reviewFifthStarInput)
                .should('be.checked')
            cy.get(selectorsLuma.reviewSubmitButton).click()
            cy.get(selectorsLuma.reviewSubmittedSuccessMessage)
                .should('exist')
                .should('contain.text','You submitted your review for moderation.')
        })

        it('Can see that a product is in stock', () => {
            // The productUrl should point to a product that is in stock
            cy.get(selectorsLuma.productStockMessage)
                .should('exist')
                .should('contain.text', 'In stock')
        })

        it('Can increment the product quantity on the pdp', () => {
            cy.get(selectorsLuma.productQty)
                .type('{uparrow}')
                .should('have.value', '2')
        })
    })

    describe('Configurable products test suite', () => {
        beforeEach(() => {
            cy.visit(productLuma.configurableProductUrl)
            cy.wait(1000)
        })

        it('can find products in the related products list', () => {
            // Configurable product has related products
            cy.get(selectorsLuma.relatedProductsTitle)
                .should('exist')
                .should('contain.text', 'Related Products')
            cy.get(selectorsLuma.relatedProductsCard)
                .should('have.length.gte', 3)
        })

        it('Can\'t add a configurable product to the cart when no configuration is selected', () => {
            cy.get(selectorsLuma.addToCartButton)
                .click()
            cy.get(selectorsLuma.forgottenField)
                .should('exist')
        })

        it('Can select product attributes', () => {
            cy.get(selectorsLuma.productAttributeSelector)
                .eq(0).find('div').first().click()
            cy.get(selectorsLuma.productAttributeSelector)
                .eq(0).find('div').first()
                .should('have.class', 'selected')
            cy.get(selectorsLuma.productAttributeSelector)
                .eq(1).find('div').first().click()
            cy.get(selectorsLuma.productAttributeSelector)
                .eq(1).find('div').first()
                .should('have.class', 'selected')
        })
    })
}

// Hyva tests
if (Cypress.env('isHyva')) {
    describe('Simple Product test suite', () => {
        beforeEach(() => {
            cy.visit(productHyva.simpleProductUrl)
        })

        it('Can see a title and image for the product', () => {
            cy.get(selectorsHyva.productTitle)
                .should('contain.text', productHyva.simpleProductName)
                .should('be.visible')
            cy.get(selectorsHyva.productImage)
                .should('have.attr', 'src')
                .should('include', 'media/catalog/product')
        })

        it('Can see a price for the product', () => {
            cy.get(selectorsHyva.productPrice)
                .should('contain', productHyva.currency)
                .then(($price) => {
                    // Still unsure about this but can't think of a cypress way to test this
                    const bool = (new RegExp(productHyva.priceRegexp)).test($price[0].innerText)
                    expect(bool).to.be.true
                })
        })

        it('Can add a product to the cart from the product page', () => {
            cy.get(selectorsHyva.addToCartButton).click()
            cy.get(selectorsHyva.successMessage)
                .contains(`You added ${productHyva.simpleProductName} to your shopping cart.`)
            // Requires a wait for the product count to update
            cy.wait(1000)
            cy.get(selectorsHyva.cartIconProductCount)
                .invoke('text').then(parseFloat)
                .should('be.gte', 1)
        })

        it('Can see breadcrumbs', () => {
            cy.get(selectorsHyva.breadCrumbItems)
                .should('have.length.gte', 2)
        })

        it('Can\'t add a product to a wishlist when the user in not logged in', () => {
            cy.get(selectorsHyva.addToWishlistButton).click()
            cy.get(selectorsHyva.errorMessage)
                .should('exist')
                .should("contain.text", 'You must login or register to add items to your wishlist.')
        })

        it('Can add a product to the wishlist when customer is logged in', () => {
            const customerMail = Date.now() + accountHyva.customer.customer.email
            cy.visit(accountHyva.routes.accountCreate)
            Account.createNewCustomer(accountHyva.customer.customer.firstname, accountHyva.customer.customer.lastname, customerMail, accountHyva.customer.password)
            cy.visit(Product.routes.simpleProduct)
            cy.get(selectorsHyva.addToWishlistButton).click().then(() => {
                cy.get(selectorsHyva.successMessage)
                    .should('include.text', `${productHyva.simpleProductName} has been added to your Wish List.`)
                    .should('be.visible')
            })
        })

        it('Can see product review score and the individual reviews', () => {
            cy.get(selectorsHyva.productRatingStar)
                .should('have.length', 5)
            cy.get(selectorsHyva.customerReviewTitle)
                .should('exist')
                .should('include.text','Customer Reviews')
            cy.get(selectorsHyva.productCustomerReviews)
                .should('have.length.gte', 1)
        })

        it('Can add reviews to a product', () => {
            cy.get(selectorsHyva.productCustomerReviewWriteTitle)
                .should('exist')
                .should('contain.text', 'Write Your Own Review')
            cy.get(selectorsHyva.reviewReviewerNameField).type('Someone')
                .should('have.value', 'Someone')
            cy.get(selectorsHyva.reviewSummeryField).type('Something')
                .should('have.value', 'Something')
            cy.get(selectorsHyva.reviewReviewField).type('Longer something')
                .should('have.value', 'Longer something')
            cy.get(selectorsHyva.reviewFiveStarScore).click()
            cy.get(selectorsHyva.reviewFifthStarInput)
                .should('be.checked')
            cy.get(selectorsHyva.reviewSubmitButton).click()
            cy.get(selectorsHyva.reviewSubmittedSuccessMessage)
                .should('exist')
                .should('contain.text','You submitted your review for moderation.')
        })

        it('Can see that a product is in stock', () => {
            // The productUrl should point to a product that is in stock
            cy.get(selectorsHyva.productStockMessage)
                .should('exist')
                .should('contain.text', 'In stock')
        })

        it('Can\'t add an out of stock product to the cart', () => {
            Magento2RestApi.updateProductQty(productHyva.outOfStockProductSku, 0)
            cy.visit(productHyva.outOfStockProductUrl)
            cy.get(selectorsHyva.productStockMessage)
                .should('exist')
                .should('contain.text', 'Out of stock')
            cy.get(selectorsHyva.addToCartButton)
                .should('not.exist')
        })

        it('Can increment the product quantity on the pdp', () => {
            cy.get(selectorsHyva.productQty)
                .type('{uparrow}')
                .should('have.value', '2')
        })
    })

    describe('Configurable products test suite', () => {
        beforeEach(() => {
            cy.visit(productHyva.configurableProductUrl)
        })

        it('can find products in the related products list', () => {
            // Configurable product has related products
            cy.get(selectorsHyva.relatedProductsTitle)
                .should('exist')
                .should('contain.text', 'Related Products')
            cy.get(selectorsHyva.relatedProductsCard)
                .should('have.length.gte', 3)
        })

        it('Can\'t add a configurable product to the cart when no configuration is selected', () => {
            cy.get(selectorsHyva.addToCartButton)
                .click()
            // The html5 form validation gives the form a pseudo class of invalid if a required option was forgotten
            cy.get(selectorsHyva.forgottenField)
                .should('exist')
        })

        it('Can select product attributes', () => {
            cy.get(selectorsHyva.productAttributeSelector)
                .eq(0).find('div').first().click()
            cy.get(selectorsHyva.productAttributeSelector)
                .eq(0).find('input').first()
                .should('be.checked')
            cy.get(selectorsHyva.productAttributeSelector)
                .eq(1).find('div').first().click()
            cy.get(selectorsHyva.productAttributeSelector)
                .eq(1).find('input').first()
                .should('be.checked')
        })
    })
}
