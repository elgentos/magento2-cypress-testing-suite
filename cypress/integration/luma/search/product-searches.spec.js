import { Search } from "../../../page-objects/luma/search"
import searchLuma from "../../../fixtures/luma/search"
import selectorsLuma from "../../../fixtures/selectors/luma/search"


describe('Perform searches', () => {
    beforeEach(() => {
        cy.visit('/')
    })

    it('Can perform search with multiple hits', () => {
        Search.search(searchLuma.productCategory)
        cy.get(selectorsLuma.pageHeader)
            .should('have.text', `Search results for: '${searchLuma.productCategory}'`)
    })

    it('Can find a single product', () => {
        Search.search(searchLuma.singleProduct)
        cy.get(selectorsLuma.toolbarNumber)
            .should('be.visible')
            .should('contain.text', '1')
    })

    it('Can perform search with no search results', () => {
        Search.search(searchLuma.noResults)
        cy.get(selectorsLuma.pageHeader)
            .should('be.visible')
            .should("contain.text", `Search results for: '${searchLuma.noResults}'`)
        cy.get(selectorsLuma.noResultsMessage)
            .should('be.visible')
            .should('contain.text', 'Your search returned no results.')
    })

    it('Can see suggestions when entering search terms', () => {
        cy.get(selectorsLuma.headerSearchIcon).click()
        cy.get(selectorsLuma.headerSearchField)
            .should('be.visible')
            .type(`${searchLuma.getHint}`)
        cy.get(selectorsLuma.searchSuggestions)
            .should('be.visible')
            .should('contain.text', searchLuma.hintResult)
    })
})
