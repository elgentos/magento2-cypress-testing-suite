import homepage from "../../fixtures/luma/homepage"
import {checkAccessibility} from "../../support/utils"

describe('Home page accessibility tests', () => {
    beforeEach(() => {
        cy.visit(homepage.homePageUrl)
    })

    it('Check Homepage', () => {
        cy.injectAxe()
        checkAccessibility()
    })
})
