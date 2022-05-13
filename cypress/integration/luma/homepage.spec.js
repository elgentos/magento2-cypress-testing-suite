import homepage from '../../fixtures/luma/homepage'
import selectors from '../../fixtures/luma/selectors/homepage'
import globalSelectors from '../../fixtures/globalSelectors'
import account from '../../fixtures/account'
import {shouldHaveErrorMessage, shouldHaveSuccessMessage} from '../../support/utils'

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

    it('Can open category', () => {
        cy.get(selectors.headerNavSubCategory)
            .first()
            .click({force: true})
        cy.get(selectors.mainHeading)
            .should('contain.text', homepage.subCategoryName)
    })

    it('Can subscribe to newsletter', () => {
        cy.get(selectors.subscribeToNewsletterField).type(account.customer.customer.email)
        cy.get(selectors.newsletterSubscribeButton).click()
        cy.wait(2000)
        cy.get('.page.messages').then(($messageSection) => {
            if (!$messageSection.find(globalSelectors.errorMessage).text().trim()) {
                shouldHaveSuccessMessage(homepage.subscriptionSuccess)
            } else {
                shouldHaveErrorMessage(homepage.subscriptionFail)
            }
        })
    })
})
