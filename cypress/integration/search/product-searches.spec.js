import { Search } from "../../page-objects/search"

// Luma imports
import searchLuma from "../../fixtures/luma/search"
import selectorsLuma from "../../fixtures/selectors/luma/search"

// Hyva imports
import searchHyva from "../../fixtures/hyva/search"
import selectorsHyva from "../../fixtures/selectors/hyva/search"

// Luma tests
if (Cypress.env('isLuma')) {
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
}

// Hyva tests
if (Cypress.env('isHyva')) {
    describe('Perform searches', () => {
        beforeEach(() => {
            cy.visit('/')
        })

        it('Can perform search with multiple hits', () => {
            Search.search(searchHyva.productCategory)
            cy.get(selectorsHyva.pageHeader)
                .should('have.text', `Search results for: '${searchHyva.productCategory}'`)
        })

        it('Can find a single product', () => {
            Search.search(searchHyva.singleProduct)
            cy.get(selectorsHyva.successMessage)
                .should('be.visible')
                .should('contain.text', `${searchHyva.sinpleProductName} is the only product matching your '${searchHyva.singleProduct}' search.`)
        })

        it('Can perform search with no search results', () => {
            Search.search(searchHyva.noResults)
            cy.get(selectorsHyva.pageHeader)
                .should('be.visible')
                .should("contain.text", `Search results for: '${searchHyva.noResults}'`)
            cy.get(selectorsHyva.noResultsMessage)
                .should('be.visible')
                .should('contain.text', 'Your search returned no results.')
        })

        it('Can see suggestions when entering search terms', () => {
            cy.get(selectorsHyva.headerSearchIcon).click()
            cy.get(selectorsHyva.headerSearchField)
                .should('be.visible')
                .type(`${searchHyva.getHint}`)
            cy.get(selectorsHyva.searchSuggestions)
                .should('be.visible')
                .should('contain.text', searchHyva.hintResult)
        })
    })
}
