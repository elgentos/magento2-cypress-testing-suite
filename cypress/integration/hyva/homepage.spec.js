import homepage from "../../fixtures/hyva/homepage"
import selectors from "../../fixtures/hyva/selectors/homepage"
import product from "../../fixtures/hyva/product"
import account from "../../fixtures/account"

describe('Home page tests', () => {
    beforeEach(() => {
        cy.visit(homepage.homePageUrl)
    })

    it('Can visit the homepage and it contains products', () => {
        cy.get(selectors.mainHeading)
            .should('contain.text', homepage.titleText)
        cy.get(selectors.productCard)
            .should('have.length.gte', 4)
    })

    it('Can perform search from homepage', () => {
        cy.get(selectors.searchIcon).click()
        cy.get(selectors.searchBar)
            .should('be.visible')
            .type(`${product.products.simpleProductName}{enter}`)
        cy.get(selectors.mainHeading)
            .should('contain.text', product.products.simpleProductName)
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
        cy.wait(0)
        cy.get('#messages').then(($messageSection) => {
            if(!$messageSection.find(selectors.failedMessage).text().trim()){
                cy.get(selectors.successMessage).should('contain.text', homepage.subscriptionSuccess)
            } else {
                cy.get(selectors.failedMessage).should('contain.text', homepage.subscriptionFail)
            }
        })
    })
})
