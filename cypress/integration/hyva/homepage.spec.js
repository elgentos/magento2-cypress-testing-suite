import homepage from '../../fixtures/hyva/homepage.json';
import selectors from '../../fixtures/hyva/selectors/homepage.json';
import searchSelectors from '../../fixtures/hyva/selectors/search.json';
import product from '../../fixtures/hyva/product.json';
import account from '../../fixtures/account.json';
import cart from "../../fixtures/hyva/selectors/cart.json";

describe('Home page tests', () => {
    beforeEach(() => {
        cy.visit(homepage.homePageUrl);
    });

    it('Can visit the homepage and it contains products', () => {
        cy.get(selectors.mainHeading).should(
           'contain.text',
           homepage.titleText
        );
        cy.get(selectors.productCard).should('have.length.gte', 4);
    });

    it('Can perform search from homepage', () => {
        cy.get(searchSelectors.headerSearchIcon).click();
        cy.get(searchSelectors.headerSearchField)
           .should('be.visible')
           .type(`${product.simpleProductName}{enter}`);
        cy.get(selectors.mainHeading).should(
            'contain.text',
            product.simpleProductName
        );
    });

    it('Can open category', () => {
        // Force because hover is not (yet?) possible in cypress
        cy.get(selectors.headerNavSubCategory).click();
        cy.get(selectors.mainHeading).should(
           'contain.text',
           homepage.subCategoryName
        );
    });

    it('Can subscribe to newsletter', () => {
        cy.get(selectors.subscribeToNewsletterField).type(
            Date.now() + account.customer.customer.email
        );
        cy.get(selectors.newsletterSubscribeButton).click();
        cy.wait(0);
        cy.get('#messages').then(($messageSection) => {
            if (!$messageSection.find(selectors.failedMessage).text().trim()) {
                cy.get(selectors.successMessage).should(
                    'contain.text',
                    homepage.subscriptionSuccess
                );
            } else {
                cy.get(selectors.failedMessage).should(
                    'contain.text',
                    homepage.subscriptionFail
                );
            }
        });
    });
    it('Can add product to the cart when add to cart button is visible', () => {
        cy.get(selectors.addToCartButton).first().click();
        cy.get(cart.product.messageToast)
           .should("include.text", "to your shopping cart")
           .should("be.visible");
    });
});
