import product from "../../../fixtures/hyva/product.json";
import selectors from "../../../fixtures/hyva/selectors/product.json";
import homepageSelectors from "../../../fixtures/hyva/selectors/homepage.json";

describe('Bundle products test suite', () => {
    beforeEach(() => {
        cy.visit(product.bundledProductUrl);
    });
    it('Can render the product name', () => {
        cy.get(selectors.mainHeading)
            .should('contain.text', product.bundledProductName)
            .should('be.visible');
    })
    it('Can set the price to zero when every associated product qty is zero', () => {
        cy.get('input[id$=-qty-input]').each(input => {
            cy.wrap(input).type('{selectall}0').blur();
            cy.wait(0); // wait for alpine to process change event
        })
        cy.get('.bundle-info .final-price').first().should('contain.text', '$0.00')
    })
    it('Can calculate the price based on selected options', () => {
        // sum up the price of all first options
        const prices = [];
        cy.get('.product-info-main fieldset .control').then(associatedProductOptions => {
            associatedProductOptions.map((idx, product) => {
                const firstOptionPrice = product.querySelector('.price-notice');
                const m = firstOptionPrice.innerText.trim().match(/(?<sign>[+-]?)\s+\S(?<price>[\d.]+)/)
                m && prices.push((m.groups.sign === '+' ? 1 : -1) * parseFloat(m.groups.price))

            })
        })
        // set qty for each associated product to 1
        cy.get('input[id$=-qty-input]').each(input => {
            cy.wrap(input).type('{selectall}1').blur();
            cy.wait(0); // wait for alpine to process change event
        })
        cy.get('#bundleSummary .final-price').first().then(finalPrice => {
            cy.wrap(finalPrice).should('contain.text', `$${(prices.reduce((sum, n) => sum + n, 0))}`)
        })
    })
    it('Can display selection quantities', () => {
        let expectedNames = [];
        cy.get('.product-info-main fieldset > div > label').then(associatedProductNames => {
            expectedNames = associatedProductNames.map((idx, productName) => productName.innerText.trim());
        })
        // set associated product qty to 1, 2, 3...
        cy.get('input[id$=-qty-input]').each((input, idx) => {
            cy.wrap(input).type(`{selectall}${idx + 1}`).blur();
            cy.wait(0); // wait for alpine to process change event
        })

        // check the order of associated product names in the summary matches the expected names
        cy.get('#bundleSummary .bundle.items li > span').each((actual, idx) => {
            expect(actual.text()).to.eq(expectedNames[idx]);
        })

        // check the associated product qty in the summary is 1, 2, 3...
        cy.get('#bundleSummary .bundle.items li > div > span:first-child').each((actualQty, idx) => {
            expect(actualQty.text()).to.eq(`${idx + 1}`);
        })
    })
    it('Can add a bundled product to the cart', () => {
        cy.get('input[id$=-qty-input]').each(input => {
            cy.wrap(input).type('{selectall}1').blur();
            cy.wait(0); // wait for alpine to process change event
        })
        cy.get(selectors.addToCartButton).click();
        cy.get(homepageSelectors.successMessage).contains(
            `You added ${product.bundledProductName} to your shopping cart.`
        );
        cy.get(selectors.cartIconProductCount).invoke('text').should('not.eq', '') // wait for product count to update
        cy.get(selectors.cartIconProductCount).invoke('text').then(parseFloat).should('be.gte', 1);
    })
})
