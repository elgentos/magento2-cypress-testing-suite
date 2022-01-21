import homepage from "../fixtures/homepage"
import selectors from "../fixtures/selectors/luma/homepage"
import product from "../fixtures/product"
import account from "../fixtures/account"

describe('Home page tests', () => {
    beforeEach(() => {
        cy.visit(homepage.homePageUrl)
    })

    it('Can visit the homepage and it contains products', () => {
        cy.get(selectors.mainTitle)
            .should('contain.text', homepage.titleText)
        cy.get(selectors.productCard)
            .should('have.length.gte', 7)
    })

    it('Can perform search from homepage', () => {
        cy.get(selectors.searchIcon)
            .should('be.visible')
            .type(`${product.simpleProductName}{enter}`)
        cy.get(selectors.mainHeading)
            .should('contain.text', product.simpleProductName)
    })

    it('Can open category',  () => {
        // Force because hover is not (yet?) possible in cypress
        cy.get(selectors.headerNavSubCategory)
            .click({force:true})
        cy.get(selectors.mainHeading)
            .should('contain.text', homepage.subCategoryName)
    })

    it('Can subscribe to newsletter', () => {
        cy.get(selectors.subscribeToNewsletterField).type(Date.now() + account.customer.customer.email)
        cy.get(selectors.newsletterSubscribeButton).click()
        cy.get(selectors.successMessage).should('contain.text', homepage.subscriptionSuccess)
    })
})
