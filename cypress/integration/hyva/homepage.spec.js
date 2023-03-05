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

    it(["mainProduct"], "Can add a product to the cart when the add product button is present", () => {
        cy.get(selectors.mainFirstProductSliderProductName)
            .should("be.visible")
            .then((thisProductName) => {
                cy.wrap(thisProductName.text()).as("productName");
                cy.log("productName has been stored for later:", [ cy.get("@productName") ]);
            });
        cy.get(selectors.mainFirstProductSliderAddToCart)
            .should("be.visible")
            .and("have.attr", "aria-label", "Add to Cart")
            .click();
        cy.get(selectors.contactFormSuccess)
            .should("be.visible")
            .then((thisMessageText) => {
                // Look up the previously-saved product name to compare to the success message
                cy.get("@productName").then((thisProductName) => {
                    let productName = String(thisProductName).replace(/\n/g, "").trim();
                    expect(thisMessageText.text()).to.include("You added " + productName + " to your shopping cart.");
                });
            });
    });

    it('Can add product to the cart when add to cart button is visible', () => {
        cy.get(selectors.addToCartButton).first().click();
        cy.get(cart.product.messageToast)
           .should("include.text", "to your shopping cart")
           .should("be.visible");
    });

    it(["header"], "Can visit the homepage from the logo link in the header", () => {
        cy.get(selectors.headerLogo).should("be.visible").and("have.attr", "href", Cypress.config("baseUrl") + "/");
    });

    it(["header"], "Can visit the categories from the header", () => {
        cy.log("Testing single category menus...");
        cy.get(selectors.categoryFirst)
            .should("be.visible")
            .and("have.attr", "href", Cypress.config("baseUrl") + "/what-is-new.html")
            .click();
        cy.location("href").should("contain", "/what-is-new.html", "First level category location is correct");
        cy.get(selectors.categoryTitle)
            .should("be.visible")
            .and("have.text", "What's New", "The first category title matches");
        cy.log("Testing secondary category menus...");
        cy.get(selectors.categorySecond)
            .should("be.visible")
            .and("have.attr", "href", Cypress.config("baseUrl") + "/women.html")
            .trigger("mouseenter");
        cy.log("Visit the secondary category level");
        cy.get(selectors.categorySecondChild)
            .should("be.visible")
            .and("have.attr", "href", Cypress.config("baseUrl") + "/women/tops-women.html")
            .click();
        cy.location("href").should("contain", "/women/tops-women.html", "Second level category location is correct");
        cy.get(selectors.categoryTitle)
            .should("be.visible")
            .and("have.text", "Tops", "The second category title matches");
    });

    it(["header"], "Can search from the header", () => {
        cy.get(selectors.headerSearchButton).click();
        cy.get(selectors.headerSearch).type("gear{ENTER}");
        cy.location("href").should("contain", "/catalogsearch/result/?q=gear", "Search result page location is correct");
        cy.get(selectors.categoryTitle)
            .should("be.visible")
            .and("have.text", "Search results for: 'gear'", "Search result page title is correct");
        cy.get(selectors.searchResultsGrid)
            .should("be.visible")
            .and("have.length.at.least", 1, "Should be at least one product in the results");
    });

    it(["header"], "Can see the customer menu from the header", () => {
        cy.get(selectors.headerCustomerMenu)
            .should("be.visible")
            .and("have.attr", "href", Cypress.config("baseUrl") + "/customer/account/")
            .click();
        cy.get(selectors.headerCustomerLogIn)
            .should("be.visible")
            .and("have.attr", "href", Cypress.config("baseUrl") + "/customer/account/index/");
        cy.get(selectors.headerCustomerCreateAccount)
            .should("be.visible")
            .and("have.attr", "href", Cypress.config("baseUrl") + "/customer/account/create/");
    });

    it(["header"], "Can see the minicart from the header", () => {
        cy.get(selectors.headerMiniCart)
            .should("be.visible")
            .and("have.attr", "href", Cypress.config("baseUrl") + "/checkout/cart/index/");
        cy.log("See the minicart test suite for further functionality testing");
    });

    it(["footer"], "Can visit the login page from the footer", () => {
        cy.get(selectors.footerMyAccount).click();
        cy.get(selectors.pageTitle).should(
            "contain.text",
            homepage.pageTitleLogin,
            "Page has the correct title"
        );
    });

    it(["footer"], "Can visit Search Terms in the footer", () => {
        cy.get(selectors.footerSearchTerms).click();
        cy.get(selectors.pageTitle).should(
            "contain.text",
            homepage.pageTitleSearchTerms,
            "Page has the correct title"
        );
        // assert at least one exists because this spec executes one search above
        cy.get(selectors.searchTerms).should(
            "have.length.at.least",
            1,
            "At least one popular search terms exist"
        );
        cy.get(selectors.searchTerms).contains(product.simpleProductName)
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
