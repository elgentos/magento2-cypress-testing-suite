import homepage from '../../fixtures/hyva/homepage.json';
import selectors from '../../fixtures/hyva/selectors/homepage.json';
import searchSelectors from '../../fixtures/hyva/selectors/search.json';
import product from '../../fixtures/hyva/product.json';
import account from '../../fixtures/account.json';
import cart from "../../fixtures/hyva/selectors/cart.json";
import {Account} from '../../page-objects/hyva/account';

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
        cy.get(selectors.headerNavSubCategory).click({force: true});
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

    it(["footer"], "Can visit the My Account page in the footer", () => {
        cy.get(selectors.footerMyAccount).click();
        Account.login(
            account.customer.customer.email,
            account.customer.password
        );
        cy.get(selectors.pageTitle).should(
            "contain.text",
            homepage.pageTitleMyAccount,
            "Page has the correct title"
        );
        cy.get(selectors.myAccountContactInformationBlock).should(
            "contain.text",
            (account.customer.customer.firstname + " " + account.customer.customer.lastname),
            "Customer name is in the contact information section"
        ).and(
            "contain.text",
            account.customer.customer.email,
            "Customer email is in the contact information section"
        );
    });

    it(["footer"], "Can visit Search Terms in the footer", () => {
        cy.get(selectors.footerSearchTerms).click();
        cy.get(selectors.pageTitle).should(
            "contain.text",
            homepage.pageTitleSearchTerms,
            "Page has the correct title"
        );
        cy.get(selectors.searchTerms).should(
            "have.length.at.least",
            4,
            "At least four popular search terms exist"
        );
    });

    it(["footer"], "Can visit Contact form in the footer", () => {
        cy.get(selectors.footerContact).click();
        cy.get(selectors.contactFormName).type(account.customer.customer.firstname + " " + account.customer.customer.lastname);
        cy.get(selectors.contactFormEmail).type(account.customer.customer.email);
        cy.get(selectors.contactFormTelephone).type(account.customerInfo.phone);
        cy.get(selectors.contactFormComment).type(homepage.contactFormComment);
        cy.get(selectors.contactFormSubmit).click();
        cy.get(selectors.contactFormSuccess).should(
            "contain.text",
            homepage.contactFormSuccess,
            "Contact form returns a success message"
        );
    });
});
