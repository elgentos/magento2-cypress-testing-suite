import selectors from "../../../../fixtures/hyva/selectors/cms.json";
import cms from "../../../../fixtures/hyva/cms.json";

describe('CMS tests', () => {
  it('Can display the default 404 page', () => {
    cy.visit(cms.wrongPageUrl, {failOnStatusCode: false});
    cy.get(selectors.pageTitle).should('contain.text', cms.errorPageTitle)
  })

  it('Can open default CMS pages', () => {
    cy.get(selectors.cmsDefaultPages).each((cmsPage, i) => {
      cy.get(cmsPage).click()
      cy.get(selectors.pageTitle).should('contain.text', cms.cmsTitles[i])
    })
  })
})