// Luma imports
import homepageLuma from "../fixtures/luma/homepage"
import selectorsLuma from "../fixtures/selectors/luma/homepage"
import productLuma from "../fixtures/luma/product"
import accountLuma from "../fixtures/luma/account"

// Hyva imports
import homepageHyva from "../fixtures/hyva/homepage"
import selectorsHyva from "../fixtures/selectors/hyva/homepage"
import productHyva from "../fixtures/hyva/product"
import accountHyva from "../fixtures/hyva/account"

// Luma tests
if (Cypress.env('isLuma')) {
    describe('Home page tests', () => {
        beforeEach(() => {
            cy.visit(homepageLuma.homePageUrl)
        })

        it('Can visit the homepage and it contains products', () => {
            cy.get(selectorsLuma.mainTitle)
                .should('contain.text', homepageLuma.titleText)
            cy.get(selectorsLuma.productCard)
                .should('have.length.gte', 1)
        })


        it('Can perform search from homepage', () => {
            cy.get(selectorsLuma.searchIcon)
                .should('be.visible')
                .type(`${productLuma.simpleProductName}{enter}`)
            cy.get(selectorsLuma.mainHeading)
                .should('contain.text', productLuma.simpleProductName)
        })

        it('Can open category', () => {
            cy.get(selectorsLuma.headerNavSubCategory)
                .click({force: true})
            cy.get(selectorsLuma.mainHeading)
                .should('contain.text', homepageLuma.subCategoryName)
        })

        it('Can subscribe to newsletter', () => {
            cy.get(selectorsLuma.subscribeToNewsletterField).type(accountLuma.customer.customer.email)
            cy.get(selectorsLuma.newsletterSubscribeButton).click()
            cy.wait(2000)
            cy.get('.page.messages').then(($messageSection) => {
                if (!$messageSection.find(selectorsLuma.failedMessage).text().trim()) {
                    cy.get(selectorsLuma.successMessage).should('contain.text', homepageLuma.subscriptionSuccess)
                } else {
                    cy.get(selectorsLuma.failedMessage).should('contain.text', homepageLuma.subscriptionFail)
                }
            })
        })
    })
}

// Hyva tests
if (Cypress.env('isHyva')) {
    describe('Home page tests', () => {
        beforeEach(() => {
            cy.visit(homepageLuma.homePageUrl)
        })

        it('Can visit the homepage and it contains products', () => {
            cy.get(selectorsHyva.mainHeading)
                .should('contain.text', homepageHyva.titleText)
            cy.get(selectorsHyva.productCard)
                .should('have.length.gte', 4)
        })


        it('Can perform search from homepage', () => {
            cy.get(selectorsHyva.searchIcon).click()
            cy.get(selectorsHyva.searchBar)
                .should('be.visible')
                .type(`${productHyva.simpleProductName}{enter}`)
            cy.get(selectorsHyva.mainHeading)
                .should('contain.text', productHyva.simpleProductName)
        })

        it('Can open category',  () => {
            cy.get(selectorsHyva.headerNavSubCategory)
                .click({force:true})
            cy.get(selectorsHyva.mainHeading)
                .should('contain.text', homepageHyva.subCategoryName)
        })

        it('Can subscribe to newsletter', () => {
            cy.get(selectorsHyva.subscribeToNewsletterField).type(accountHyva.customer.customer.email)
            cy.get(selectorsHyva.newsletterSubscribeButton).click()
            cy.wait(0)
            cy.get('#messages').then(($messageSection) => {
                if(!$messageSection.find(selectorsHyva.failedMessage).text().trim()){
                    cy.get(selectorsHyva.successMessage).should('contain.text', homepageHyva.subscriptionSuccess)
                } else {
                    cy.get(selectorsHyva.failedMessage).should('contain.text', homepageHyva.subscriptionFail)
                }
            })
        })
    })
}
