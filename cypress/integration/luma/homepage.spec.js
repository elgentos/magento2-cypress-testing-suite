import homepage from "../../fixtures/luma/homepage"
import selectors from "../../fixtures/luma/selectors/homepage"
import product from "../../fixtures/luma/product"
import account from "../../fixtures/account"
import {isMobile} from "../../support/utils";

describe('Home page tests', () => {
    beforeEach(() => {
        cy.visit(homepage.homePageUrl)
    })

    it('Can visit the homepage and it contains products', () => {
        cy.get(selectors.mainTitle)
            .should('contain.text', homepage.titleText)
        cy.get(selectors.productCard)
            .should('have.length.gte', 1)
    })

    it('Can perform search from homepage', () => {
        if(isMobile()) {
            cy.get(selectors.searchIconMobile).click()
        }
        cy.get(selectors.searchIcon)
            .should('be.visible')
            .type(`${product.simpleProductName}{enter}`)
        cy.get(selectors.mainHeading)
            .should('contain.text', product.simpleProductName)
    })

    it('Can open category', () => {
        cy.get(selectors.headerNavSubCategory)
            .click({force: true})
        cy.get(selectors.mainHeading)
            .should('contain.text', homepage.subCategoryName)
    })

    it('Can subscribe to newsletter', () => {
        cy.get(selectors.subscribeToNewsletterField).type(account.customer.customer.email)
        cy.get(selectors.newsletterSubscribeButton).click()
        cy.wait(2000)
        cy.get('.page.messages').then(($messageSection) => {
            if (!$messageSection.find(selectors.failedMessage).text().trim()) {
                cy.get(selectors.successMessage).should('contain.text', homepage.subscriptionSuccess)
            } else {
                cy.get(selectors.failedMessage).should('contain.text', homepage.subscriptionFail)
            }
        })
    })
})
