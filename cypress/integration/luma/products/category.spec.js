import category from '../../../fixtures/category'
import selectors from '../../../fixtures/luma/selectors/category'
import {isMobile} from '../../../support/utils'

describe('Category page tests', () => {
    beforeEach(() => {
        cy.visit(category.categoryUrl)
        cy.get('#page-title-heading .base')
            .should('contain.text', category.category)
    })

    it(`Can visit the category page and filters on ${category.filterBy}`, () => {
        if (isMobile()) {
            cy.contains('Shop By').click()
        }
        cy.contains(selectors.filterTitle, category.filterBy)
            .should('exist')
        cy.get(selectors.filterOption)
            .contains(category.filterBy)
            .get(selectors.filterByLabel)
            .first()
            .click({force: true}) // Only visible when hovering
        cy.url()
            .should('contain', `?${category.filterQueryParam}=`)
    })

    it('Can sort products on price from lowest to highest', () => {
        cy.get(selectors.sortBySelect).first().select(category.selectByPrice);
        cy.get(selectors.productPriceDataAtt).eq(0).invoke('data', 'price-amount')
            .then((firstPrice) => {
                cy.get(selectors.productPriceDataAtt)
                    .eq(1)
                    .invoke('data', 'price-amount')
                    .should('be.lte', firstPrice)
            });
    })

    it('Can change the number of products to be displayed', () => {
        cy.get(selectors.highestNumberOfProductsShowOption).find('option').eq(1).invoke('val')
            .then((numberOfProducts) => {
                    cy.get(selectors.numberOfProductsSelect).select(numberOfProducts, {force: true});
                    cy.get(selectors.numberOfShownItems).first().should('have.text', numberOfProducts);
                    cy.get(selectors.categoryProductContainer).children().should('to.have.length.of.at.most', +numberOfProducts);
                }
            )
    })

    it('Can see the correct breadcrumbs', () => {
        cy.get(selectors.breadcrumbsItem).first().should('contain.text', 'Home')
        cy.get(selectors.breadcrumbsItem).eq(1).should('contain.text', 'Products')
        cy.get(selectors.breadcrumbsItem).eq(2).should('contain.text', category.category)
    })

    if(!isMobile()) {
        it('Can switch between list and grid view', () => {
            cy.get(selectors.categoryProductGridWrapper).should('be.visible')
            cy.get(selectors.viewToggle).click()
            cy.get(selectors.categoryProductListWrapper).should('be.visible')
        })
    }

    it('Can move to the next page using the pages navigation', () => {
        cy.get('.pages').then(($mainColumn) => {
            if ($mainColumn[0].querySelector(selectors.pageNavigation)) {
                cy.get(selectors.pageNavigation).first().should('to.have.length.of.at.most', 6)
                cy.get(selectors.pageLink).first().contains('2').click({force: true})
                // Check that we are on the second page, either of these assertions would be fine?
                cy.url().then((url) => {
                    expect(url.includes('p=2')).to.be.true
                })
                cy.get(selectors.secondPageItem).first().should('include.text', '2').should('not.have.attr', 'href')
            } else {
                cy.get(selectors.pageNavigation).should('not.exist')
            }
        })
    })
})
