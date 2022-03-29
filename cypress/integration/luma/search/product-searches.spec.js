import {Search} from '../../../page-objects/luma/search'
import searchLuma from '../../../fixtures/luma/search'
import selectors from '../../../fixtures/luma/selectors/search'
import product from '../../../fixtures/luma/product'
import {isMobile} from '../../../support/utils'
import homepage from '../../../fixtures/luma/homepage.json'

describe('Perform searches', () => {
    beforeEach(() => {
        cy.visit(homepage.homePageUrl)
    })

    it('Can perform search from the homepage', () => {
        if(isMobile()) {
            cy.get(selectors.headerSearchIcon).click()
        }
        cy.get(selectors.headerSearchIcon)
            .should('be.visible')
            .type(`${product.simpleProductName}{enter}`)
        cy.get(selectors.pageHeader)
            .should('contain.text', product.simpleProductName)
    })

    it('Can perform search with multiple hits', () => {
        Search.search(searchLuma.searchTerm)
        cy.get(selectors.pageHeader)
            .should('have.text', `Search results for: '${searchLuma.searchTerm}'`)
        cy.get(`${selectors.resultContainer} ${selectors.resultItem}`)
            .should('have.length.gt', 0)
    })

    it('Can find a single product', () => {
        Search.search(product.simpleProductName)
        cy.get(selectors.resultContainer)
            .should('contain.text', product.simpleProductName)
    })

    it('Can perform search with no search results', () => {
        Search.search(searchLuma.noResults)
        cy.get(selectors.pageHeader)
            .should('be.visible')
            .should('contain.text', `Search results for: '${searchLuma.noResults}'`)
        cy.get(selectors.noResultsMessage)
            .should('be.visible')
            .should('contain.text', 'Your search returned no results.')
    })

    it('Can see suggestions when entering search terms', () => {
        if (isMobile()) {
            cy.get(selectors.headerSearchIconMobile).click()
        }
        cy.get(selectors.headerSearchIcon).click()
        cy.get(selectors.headerSearchField)
            .should('be.visible')
            .type(`${searchLuma.searchTerm}`)
        cy.get(selectors.searchSuggestions)
            .should('be.visible')
            .should('contain.text', searchLuma.hintResult)
    })
})
