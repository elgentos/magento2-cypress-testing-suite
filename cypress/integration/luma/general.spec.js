import homepage from "../../fixtures/luma/homepage.json";
import selectors from "../../fixtures/luma/selectors/homepage";

describe(['cx'], 'General page tests', function () {
    beforeEach(() => {
        cy.visit(homepage.homePageUrl)
        cy.wait(2000)
    })

    it('Check if the logo has title attribute set', function () {
        cy.get(selectors.logoImage).invoke('attr', 'title').should('not.be.empty');
    })

    it('Check if the favicon exists', function () {
        cy.get(selectors.favicon).should('exist');
    })
})
