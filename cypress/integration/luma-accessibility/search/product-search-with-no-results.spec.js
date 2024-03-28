import { Search } from "../../../page-objects/luma/search"
import searchLuma from "../../../fixtures/luma/search"
import {checkAccessibility} from "../../../support/utils"

describe('Product search with no results accessibility test', () => {
    it('Check search results with no results', () => {
        cy.visit('/')
        Search.search(searchLuma.noResults)
        cy.injectAxe()
        checkAccessibility()
    })
})
