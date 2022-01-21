import { Search } from "../../page-objects/search"
import search from "../../fixtures/search"
import selectors from "../../fixtures/selectors/luma/search"

describe('Perform searches', () => {
    beforeEach(() => {
        cy.visit('/')
    })

    it('Can perform search with multiple hits', () => {
        Search.search(search.productCategory)
        cy.get(selectors.pageHeader)
            .should('have.text', `Suchergebnisse für "${search.productCategory}"`)
    })

    it('Can find a single product', () => {
        Search.search(search.singleProduct)
        cy.get(selectors.toolbarNumber)
            .should('be.visible')
            .should('contain.text', '1')
    })

    it('Can perform search with no search results', () => {
        Search.search(search.noResults)
        cy.get(selectors.pageHeader)
            .should('be.visible')
            .should("contain.text", `Suchergebnisse für "${search.noResults}"`)
        cy.get(selectors.noResultsMessage)
            .should('be.visible')
            .should('contain.text', 'Ihre Suche ergab keine Treffer.')
    })

    it('Can see suggestions when entering search terms', () => {
        cy.get(selectors.headerSearchIcon).click()
        cy.get(selectors.headerSearchField)
            .should('be.visible')
            .type(`${search.getHint}`)
        cy.get(selectors.searchSuggestions)
            .should('be.visible')
            .should('contain.text', search.hintResult)
    })
})
