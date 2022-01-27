import { Account } from "../../page-objects/account.json";
import { Magento2RestApi } from "../../support/magento2-rest-api.js";
import account from "../../fixtures/account.json";
import checkout from "../../fixtures/checkout.json";
import product from "../../fixtures/product.json";
import checkoutSelectors from "../../fixtures/selectors/hyva/checkout.json";
import selectors from "../../fixtures/selectors/hyva/account.json";

describe("Account test creation", () => {
    it("Can create an account", () => {
        cy.visit(account.routes.accountCreate);
        Account.createNewCustomer(
            account.customer.customer.firstname,
            account.customer.customer.lastname,
            Date.now() + account.customer.customer.email,
            account.customer.password
        );
        cy.contains(
            "Thank you for registering with Main Website Store."
        ).should("exist");
    });
});

describe("Account activities", () => {
    before(() => {
        // This no longer seems to work...
        Magento2RestApi.createCustomerAccount(account.customer);
        Account.login(
            account.customer.customer.email,
            account.customer.password
        );
        Account.createAddress(account.customerInfo);
        // We need to logout or the beforeEach will fail
        Account.logout();
    });

    beforeEach(() => {
        Account.login(
            account.customer.customer.email,
            account.customer.password
        );
        // If login fails the assertion is ignored without the wait(0)
        cy.wait(0);
        cy.contains("Please wait and try again later.").should("not.exist");
    });

    after(() => {
        // Remove the added address
        cy.get("#maincontent").then(($mainContent) => {
            if (
                $mainContent[0].querySelector("h1") &&
                $mainContent[0].querySelector("h1").innerText.trim() !==
                    "My Account"
            ) {
                Account.login(
                    account.customer.customer.email,
                    account.customer.password
                );
            }
        });
        cy.visit("/customer/address");
        cy.get("a.delete").eq(0).click();
        cy.on("window:confirm", (str) => {
            expect(str.trim()).to.eq(
                "Are you sure you want to delete this address?"
            );
            return true;
        });
    });

    it("Can use API to login", () => {
        // @TODO As of yet quite useless
        Magento2RestApi.logCustomerIn(account.customerLogin);
    });

    it("Can check your profile", () => {
        cy.visit(account.routes.accountEdit);
        Account.checkAllProfileSpecs();
    });

    it("Can change password", () => {
        cy.visit(account.routes.accountEdit);
        cy.contains("Change Password").click();
        cy.contains("Current Password").should("be.visible");
        cy.contains("New Password").should("be.visible");
        cy.contains("Change Password").click();
        Account.changePassword(
            account.customer.password,
            account.tempCustomerInfo.password
        );
        cy.contains("You saved the account information.").should("exist");
        Account.login(
            account.customer.customer.email,
            account.tempCustomerInfo.password
        );
        cy.visit(account.routes.accountEdit);
        // Change password back to normal
        Account.changePassword(
            account.tempCustomerInfo.password,
            account.customer.password
        );
        cy.contains("You saved the account information.").should("exist");
    });

    it("Can change the profile values", () => {
        let fn = account.tempCustomerInfo.firstname,
            ln = account.tempCustomerInfo.lastname;
        cy.visit(account.routes.accountEdit);
        Account.changeProfileValues(
            account.tempCustomerInfo.firstname,
            account.tempCustomerInfo.lastname
        );
        Account.goToProfile();
        cy.get(selectors.accountFirstnameInputSelector).should(
            "have.value",
            fn
        );
        cy.get(selectors.accountLastnameInputSelector).should("have.value", ln);
        cy.visit(account.routes.accountEdit).then(() => {
            let fn = account.customer.customer.firstname,
                ln = account.customer.customer.lastname;
            Account.changeProfileValues(fn, ln);
            cy.visit(account.routes.accountEdit).then(() => {
                cy.get(selectors.accountFirstnameInputSelector).should(
                    "have.value",
                    fn
                );
                cy.get(selectors.accountLastnameInputSelector).should(
                    "have.value",
                    ln
                );
            });
        });
    });

    it("Can view order history", () => {
        // Testing the link has already been done
        cy.visit(account.routes.accountOrderHistory);
        cy.get("#maincontent .column.main").then(($column) => {
            if ($column[0].querySelector(".order-products-toolbar p span")) {
                cy.log($column.find(".order-products-toolbar p span").text());
                expect(
                    +$column[0]
                        .querySelector(".order-products-toolbar p span")
                        .innerText.trim()
                        .slice(0, 1)
                ).to.be.at.least(1);
            } else {
                cy.contains("You have placed no orders.").should("exist");
            }
        });
    });

    it("Can add an address", () => {
        cy.visit(account.routes.accountAddAddress);
        Account.createAddress(account.customerInfo);
        cy.contains(selectors.addNewAddressButton, "Add New Address").click();
        cy.get(selectors.newAddressStreetInput).type(
            account.customerInfo.streetAddress
        );
        cy.get(selectors.newAddressCityInput).type(account.customerInfo.city);
        cy.get(selectors.newAddressTelInput).type(account.customerInfo.phone);
        cy.get(selectors.newAddressZipcodeInput).type(account.customerInfo.zip);
        cy.get(selectors.newAddressCountryInput).select(
            account.customerInfo.country
        );
        cy.get(selectors.newAddressRegionInput).type(
            account.customerInfo.state
        );
        cy.get(selectors.newAddressBillingInput).check();
        cy.get(selectors.newAddressShippingInput).check();
        cy.contains("Save Address").click();
    });

    it("Can change an address", () => {
        const timeStamp = Date.now().toString();
        cy.visit(account.routes.accountAddresses);
        cy.get(selectors.editAddress).first().click();
        cy.get(selectors.addressEditStreetInput).eq(0).type(timeStamp);
        cy.get(selectors.saveAddressButton).contains("Save Address").click();
        cy.contains("You saved the address.").should("exist");
    });

    it("Can add an address automatically from saved address'", () => {
        // There needs to be an item in the cart for this to work, and there needs to be a saved address
        cy.visit(product.simpleProductUrl);
        cy.contains("Add to Cart").click();
        cy.visit(checkout.checkoutUrl);
        cy.wait(1000); // this shouldn't be needed but for some reason it doesn't work without
        cy.get(
            '[id^="additional.shipping_address_selected_other_option_"]'
        ).should("have.length.above", 1);
    });

    it("Can remove an address", () => {
        Account.createAddress(account.customerInfo);
        cy.visit(account.routes.accountAddresses);
        cy.get(selectors.deleteAddressButton).last().click();
        // An confirm alert pops up asking if you are sure
        cy.on("window:confirm", (str) => {
            expect(str.trim()).to.eq(
                "Are you sure you want to delete this address?"
            );
            return true;
        });
        cy.contains("You deleted the address.").should("exist");
    });

    it("Can change the newsletter subscription", () => {
        cy.visit(account.routes.manageNewsletter);
        cy.contains("General Subscription").click();
        cy.get("#subscription").should("be.checked");
    });

    it("Can add a product the a wishlist", () => {
        cy.visit(product.simpleProductUrl);
        // cy.get('[aria-label="store logo"]').click()
        cy.get(selectors.addToWishlistButton).eq(0).click();
        cy.get(selectors.wishlistTitle)
            .should("contain.text", "My Wish List")
            .should("exist");
        cy.visit(product.wishlistUrl).then(() => {
            cy.get(".toolbar-number").should("exist");
            cy.contains(product.simpleProductName).should("exist");
        });
    });

    it("Can edit the wishlist and remove item", () => {
        // Add comment/check qtty/send list/remove item
        cy.visit(product.wishlistUrl);
        cy.get(selectors.wishlistItemCommentField).first().type("foobar");
        cy.get(selectors.wishlistUpdateButton).click();
        cy.get(selectors.wishlistItemCommentField).should(
            "contain.text",
            "foobar"
        );
        cy.get(selectors.wishlistQtyField)
            .first()
            .then(($qty) => {
                // you would actually be sure that you are counting the item you just added
                expect($qty[0].valueAsNumber).to.be.at.least(1);
            });
        cy.get(selectors.wishlistShareButton).click();
        cy.get(selectors.wishlistShareTitle)
            .should("contain.text", "Wish List Sharing")
            .should("exist");
        cy.get(selectors.wishlistShareBackLink).click();
        cy.get(selectors.wishlistRemoveItemButton)
            .first()
            .click()
            .then(() => {
                cy.get(selectors.successMessage)
                    .should(
                        "contain.text",
                        `${product.simpleProductName} has been removed from your Wish List.`
                    )
                    .should("exist");
            });
    });

    it("Can log out", () => {
        cy.get(selectors.accountIcon).click();
        cy.get(selectors.accountMenu).contains("Sign Out").click();
        cy.get(selectors.signedOutHeader).should(
            "contain.text",
            "You have signed out"
        );
    });
});

describe("Guest user test", () => {
    it("Can login from cart", () => {
        cy.visit(product.simpleProductUrl);
        cy.get(checkoutSelectors.addToCartButton).click();
        cy.get(selectors.successMessageCartLink)
            .contains("shopping cart")
            .click();
        cy.visit(account.routes.accountIndex);
        Account.login(
            account.customer.customer.email,
            account.customer.password
        );
        // If the login fails the test will still pass without this line
        cy.get(selectors.messageContents).should("not.exist");
        cy.get(checkoutSelectors.miniCartIcon).click();
        cy.get(checkoutSelectors.cartDrawerEditLink)
            .contains("View and Edit Cart")
            .click();
        cy.get(checkoutSelectors.productQuantityField).and(($input) => {
            // Could pass when I should fail?
            expect($input[0].valueAsNumber).to.be.at.least(1);
        });
        cy.contains(product.simpleProductName).should("exist");
    });

    it("Can login from checkout", () => {
        cy.visit(product.simpleProductUrl);
        cy.get(checkoutSelectors.addToCartButton)
            .should("contain.text", "Add to Cart")
            .click();
        cy.visit(checkout.checkoutUrl);
        cy.get(checkoutSelectors.checkoutLoginToggle).click();
        cy.get(checkoutSelectors.checkoutEmailLabel)
            .click()
            .type(account.customer.customer.email);
        // cy.get(checkoutSelectors.checkoutEmailField).type(account.customer.customer.email)
        cy.get(checkoutSelectors.checkoutPasswordLabel)
            .click()
            .type(account.customer.password);
        // cy.get(checkoutSelectors.checkoutPasswordField).type(account.customer.password)
        cy.get(checkoutSelectors.checkoutLoginButton).click();
        cy.get(checkoutSelectors.checkoutLoggedInEmail).should(
            "contain.text",
            account.customer.customer.email
        );
        cy.get(".message span").should("not.exist");
    });
});
