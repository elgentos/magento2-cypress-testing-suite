import { Search } from '../../../page-objects/hyva/search';
import search from '../../../fixtures/hyva/search.json';
import globalSelectors from '../../../fixtures/globalSelectors.json'
import selectors from '../../../fixtures/hyva/selectors/search.json';
import homepageSelectors from '../../../fixtures/hyva/selectors/homepage.json';

describe('Perform searches', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it('Can perform search with multiple hits', () => {
        Search.search(search.productCategory);
        cy.get(homepageSelectors.mainHeading).should(
            'contain.text',
            `Search results for: '${search.productCategory}'`
        );
        cy.get(selectors.searchResults).should('have.length.gte', 8)
    });

    it('Can find a single product', () => {
        Search.search(search.singleProduct);
        cy.get(homepageSelectors.mainHeading).should(
            'contain.text',
            `Search results for: '${search.singleProduct}'`
        );
        cy.get(selectors.searchResults).should('have.lengthOf', 1)
    });

    it('Can perform search with no search results', () => {
        Search.search(search.noResults);
        cy.get(homepageSelectors.mainHeading)
            .should('be.visible')
            .should(
                'contain.text',
                `Search results for: '${search.noResults}'`
            );
        cy.get(selectors.noResultsMessage)
            .should('be.visible')
            .should('contain.text', 'Your search returned no results.');
    });

    it('Can see suggestions when entering search terms', () => {
        cy.get(selectors.headerSearchIcon).click();
        cy.get(selectors.headerSearchField)
            .should('be.visible')
            .type(`${search.getHint}`);
        cy.get(selectors.searchSuggestions)
            .should('be.visible')
            .should('contain.text', search.hintResult);
    });
});
