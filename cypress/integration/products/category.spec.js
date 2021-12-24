import product from '../../fixtures/product'

describe('Category page tests', () => {
    beforeEach(() => {
        cy.visit(product.products.categoryUrl)
    })

    it('can go to category page and filters on color red', () => {
        cy.get('[aria-label="Red"]').click()
        cy.url().should('contain', '?color=Red')
    })

    it('can sort products on price from lowest to highest', () => {
        // If we want to make the selected metric the get targets need to be part of the fixture in an intelligent way
        cy.get('[aria-label="Sort By"]').first().select('Price');
        // Every item in the selection of items has a finalPrice, because the above line sorts
        // the selection based on price the first item in the collection of values will have a
        // data attribute data-price-amount that is less or equal to the second item
        cy.get('[data-price-type="finalPrice"]').eq(0).invoke('data', 'price-amount').then((firstValue) => {
            cy.get('[data-price-type="finalPrice"]').eq(1).invoke('data', 'price-amount').then((secondValue) => {
                const bool = firstValue < secondValue
                expect(bool).to.be.true;
            });
        });
    })

    it('can change the number of products to be displayed', () => {
        // Find what is the highest number of products that can be displayed, set that value
        // and make sure no more are being shown
        cy.get('#limiter option:last').invoke('val').then((numberOfProducts) => {
            cy.get('#limiter').select(numberOfProducts);
            cy.log(`Checking whether the toolbar shows ${numberOfProducts} being shown`)
            cy.get('#toolbar-amount:first .toolbar-number:nth-child(2)').should('have.text', numberOfProducts);
            cy.log(`Checking whether ${numberOfProducts} products are shown`)
            cy.get('.products-grid > div').children().should('to.have.length.of.at.most', +numberOfProducts);
        })
    })

    it('can see the correct breadcrumbs', () => {
        cy.get('nav[aria-label="Breadcrumb"] ul li').first().should('contain.text', 'Home')
        cy.get('nav[aria-label="Breadcrumb"] ul li').eq(1).should('contain.text', `${product.products.category}`)
        cy.get('nav[aria-label="Breadcrumb"] ul li').eq(2).should('contain.text', `${product.products.subCategory}`)
    })

    it('can switch between list and crid view', () => {
        cy.get('.mode-grid.products-grid').should('be.visible')
        cy.get('#mode-list').click()
        cy.get('.mode-list.products-list').should('be.visible')
    })

    it('can move to the next page using the pages navigation', () => {
        cy.get('ul.pages-items li').first().should('to.have.length.of.at.most', 6)
        cy.contains('.page', '2').click()
        // Check that we are on the second page, either of these assertions would be fine?
        cy.url().then((url) => {
            expect(url.includes('p=2')).to.be.true
        })
        cy.contains('.page', '2').should('not.have.attr', 'href')
    })
})
