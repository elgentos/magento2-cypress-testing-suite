import {Product} from "../../page-objects/product";

// Luma imports
import productLuma from '../../fixtures/luma/product'
import selectorsLuma from '../../fixtures/selectors/luma/category'

// Hyva imports
import productHyva from '../../fixtures/hyva/product'
import selectorsHyva from '../../fixtures/selectors/hyva/category'

// Luma tests

if (Cypress.env('isLuma')) {
    describe('Category page tests', () => {
        beforeEach(() => {
            cy.visit(Product.routes.category)
            cy.wait(3000)
        })

        it('Can visit the category page and filters on color red', () => {
            cy.contains('.filter-options-title', 'Color').click()
            cy.get(selectorsLuma.selectColorRed).click({force: true})
            cy.url().should('contain', '?color=')
        })

        it('Can sort products on price from lowest to highest', () => {
            cy.get(selectorsLuma.sortBySelect).first().select(productLuma.selectByPrice);
            cy.get(selectorsLuma.productPriceDataAtt).eq(0).invoke('data', 'price-amount')
                .then((firstPrice) => {
                    cy.get(selectorsLuma.productPriceDataAtt).eq(1).invoke('data', 'price-amount')
                        .then((secondPrice) => {
                            expect(firstPrice).to.be.lessThan(secondPrice);
                        });
                });
        })

        it('Can change the number of products to be displayed', () => {
            cy.get(selectorsLuma.highestNumberOfProductsShowOption).find('option').last().invoke('val')
                .then((numberOfProducts) => {
                        cy.get(selectorsLuma.numberOfProductsSelect).select(numberOfProducts, {force: true});
                        cy.get(selectorsLuma.numberOfShownItems).first().should('have.text', numberOfProducts);
                        cy.get(selectorsLuma.categoryProductContainer).children().should('to.have.length.of.at.most', +numberOfProducts);
                    }
                )
        })

        it('Can see the correct breadcrumbs', () => {
            cy.get(selectorsLuma.breadcrumbsItem).first().should('contain.text', 'Home')
            cy.get(selectorsLuma.breadcrumbsItem).eq(1).should('contain.text', `${productLuma.category}`)
            cy.get(selectorsLuma.breadcrumbsItem).eq(2).should('contain.text', `${productLuma.subCategory}`)
        })

        it('Can switch between list and crid view', () => {
            cy.get(selectorsLuma.categoryProductGridWrapper).should('be.visible')
            cy.get(selectorsLuma.viewToggle).click()
            cy.get(selectorsLuma.categoryProductListWrapper).should('be.visible')
        })

        it('Can move to the next page using the pages navigation', () => {
            cy.get('.pages').then(($mainColumn) => {
                if ($mainColumn[0].querySelector(selectorsLuma.pageNavigation)) {
                    cy.get(selectorsLuma.pageNavigation).first().should('to.have.length.of.at.most', 6)
                    cy.get(selectorsLuma.pageLink).first().contains('2').click({force: true})
                    // Check that we are on the second page, either of these assertions would be fine?
                    cy.url().then((url) => {
                        expect(url.includes('p=2')).to.be.true
                    })
                    cy.get(selectorsLuma.secondPageItem).first().should('include.text', '2').should('not.have.attr', 'href')
                } else {
                    cy.get(selectorsLuma.pageNavigation).should('not.exist')
                }
            })
        })
    })
}

// Hyva tests
if (Cypress.env('isHyva')) {
    describe('Category page tests', () => {
        beforeEach(() => {
            cy.visit(Product.routes.category)
        })

        it('Can visit the category page and filters on color red', () => {
            cy.get(selectorsHyva.selectColorRed).click()
            cy.url().should('contain', '?color=Red')
        })

        it('Can sort products on price from lowest to highest', () => {
            cy.get(selectorsHyva.sortBySelect).first().select(productHyva.selectByPrice);
            cy.get(selectorsHyva.productPriceDataAtt).eq(0).invoke('data', 'price-amount').then((firstPrice) => {
                cy.get(selectorsHyva.productPriceDataAtt).eq(1).invoke('data', 'price-amount').then((secondPrice) => {
                    expect(firstPrice).to.be.lessThan(secondPrice);
                });
            });
        })

        it('Can change the number of products to be displayed', () => {
            cy.get(selectorsHyva.highestNumberOfProductsShowOption).invoke('val').then((numberOfProducts) => {
                cy.get(selectorsHyva.numberOfProductsSelect).select(numberOfProducts);
                cy.get(selectorsHyva.numberOfShownItems).first().should('have.text', numberOfProducts);
                cy.get(selectorsHyva.categoryProductContainer).children().should('to.have.length.of.at.most', +numberOfProducts);
            })
        })

        it('Can see the correct breadcrumbs', () => {
            cy.get(selectorsHyva.breadcrumbsItem).first().should('contain.text', 'Home')
            cy.get(selectorsHyva.breadcrumbsItem).eq(1).should('contain.text', `${productHyva.category}`)
            cy.get(selectorsHyva.breadcrumbsItem).eq(2).should('contain.text', `${productHyva.subCategory}`)
        })

        it('Can switch between list and crid view', () => {
            cy.get(selectorsHyva.categoryProductGridWrapper).should('be.visible')
            cy.get(selectorsHyva.viewToggle).click()
            cy.get(selectorsHyva.categoryProductListWrapper).should('be.visible')
        })

        it('Can move to the next page using the pages navigation', () => {
            cy.get('.column > section').then(($mainColumn) => {
                if ($mainColumn[0].querySelector(selectorsHyva.pageNavigation)) {
                    cy.get(selectorsHyva.pageNavigation).first().should('to.have.length.of.at.most', 6)
                    cy.get(selectorsHyva.pageLink).first().contains('2').click()
                    // Check that we are on the second page, either of these assertions would be fine?
                    cy.url().then((url) => {
                        expect(url.includes('p=2')).to.be.true
                    })
                    cy.get(selectorsHyva.secondPageItem).first().should('include.text', '2').should('not.have.attr', 'href')
                } else {
                    cy.get(selectorsHyva.pageNavigation).should('not.exist')
                }
            })
        })
    })
}
