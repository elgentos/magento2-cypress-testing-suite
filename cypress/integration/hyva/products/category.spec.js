import {Product} from "../../../page-objects/product";
import product from '../../../fixtures/hyva/product'
import selectors from '../../../fixtures/selectors/hyva/category'

describe('Category page tests', () => {
    beforeEach(() => {
        cy.visit(Product.routes.category)
    })

    it('Can visit the category page and filters on color red', () => {
        cy.get(selectors.selectColorRed).click()
        cy.url().should('contain', '?color=Red')
    })

    it('Can sort products on price from lowest to highest', () => {
        cy.get(selectors.sortBySelect).first().select(product.selectByPrice);
        cy.get(selectors.productPriceDataAtt).eq(0).invoke('data', 'price-amount').then((firstPrice) => {
            cy.get(selectors.productPriceDataAtt).eq(1).invoke('data', 'price-amount').then((secondPrice) => {
                expect(firstPrice).to.be.lessThan(secondPrice);
            });
        });
    })

    it('Can change the number of products to be displayed', () => {
        cy.get(selectors.highestNumberOfProductsShowOption).invoke('val').then((numberOfProducts) => {
            cy.get(selectors.numberOfProductsSelect).select(numberOfProducts);
            cy.get(selectors.numberOfShownItems).first().should('have.text', numberOfProducts);
            cy.get(selectors.categoryProductContainer).children().should('to.have.length.of.at.most', +numberOfProducts);
        })
    })

    it('Can see the correct breadcrumbs', () => {
        cy.get(selectors.breadcrumbsItem).first().should('contain.text', 'Home')
        cy.get(selectors.breadcrumbsItem).eq(1).should('contain.text', `${product.category}`)
        cy.get(selectors.breadcrumbsItem).eq(2).should('contain.text', `${product.subCategory}`)
    })

    it('Can switch between list and crid view', () => {
        cy.get(selectors.categoryProductGridWrapper).should('be.visible')
        cy.get(selectors.viewToggle).click()
        cy.get(selectors.categoryProductListWrapper).should('be.visible')
    })

    it('Can move to the next page using the pages navigation', () => {
        cy.get('.column > section').then(($mainColumn) => {
            if($mainColumn[0].querySelector(selectors.pageNavigation)) {
                cy.get(selectors.pageNavigation).first().should('to.have.length.of.at.most', 6)
                cy.get(selectors.pageLink).first().contains('2').click()
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
