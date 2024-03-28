import { Search } from "../../../page-objects/luma/search"
import searchLuma from "../../../fixtures/luma/search"
import {checkAccessibility} from "../../../support/utils"

describe('Product search with results accessibility test', () => {
    it('Check search results', () => {
        cy.visit('/')
        Search.search(searchLuma.productCategory)
        cy.injectAxe()
        checkAccessibility()
    })
})
