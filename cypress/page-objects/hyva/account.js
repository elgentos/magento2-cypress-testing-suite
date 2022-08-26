import selectors from '../../fixtures/hyva/selectors/account.json';
import productSelectors from '../../fixtures/hyva/selectors/product.json';
import account from '../../fixtures/account.json';

export class Account {
    static login(user, pw) {
        cy.visit(account.routes.accountIndex);
        cy.get(selectors.loginEmailInputSelector).type(user);
        cy.get(selectors.loginPasswordInputSelector).type(`${pw}{enter}`);
        this.isLoggedIn();
    }

    static isLoggedIn() {
        cy.get(selectors.accountMenuItems).contains('My Account')
    }

    static goToProfile() {
        cy.contains('Account Information').click();
    }

    static checkAllProfileSpecs() {
        cy.get(selectors.accountFirstnameInputSelector).should('be.visible');
        cy.get(selectors.accountLastnameInputSelector).should('be.visible');
        cy.contains('Change Email').should('be.visible').and('not.be.checked');
        cy.contains('Change Password')
            .should('be.visible')
            .and('not.be.checked');
    }

    static changePassword(pwd, newPwd) {
        cy.get(selectors.changePasswordFormSelector).within(($from) => {
            cy.contains('Change Password').click();
            cy.get(selectors.currentPasswordInputSelector).type(pwd);
            cy.get(selectors.newPasswordInputSelector).type(newPwd);
            cy.get(selectors.newPasswordConfirmationInputSelector).type(
                `${newPwd}{enter}`
            );
        });
    }

    static changeProfileValues(fn, ln) {
        cy.get('#form-validate').within(($form) => {
            cy.get(selectors.accountFirstnameInputSelector).clear().type(fn);
            cy.get(selectors.accountLastnameInputSelector)
                .clear()
                .type(`${ln}{enter}`);
        });
        cy.window().then((w) => (w.initial = true));
    }

    static createNewCustomer(firstName, lastName, email, passwd) {
        cy.get(selectors.accountFirstnameInputSelector).type(firstName);
        cy.get(selectors.accountLastnameInputSelector).type(lastName);
        cy.get(selectors.accountEmailInputSelector).type(email);
        cy.get(selectors.newPasswordInputSelector).type(passwd);
        cy.get(selectors.newPasswordConfirmationInputSelector).type(
            `${passwd}{enter}`
        );
    }

    static logout() {
        cy.get(selectors.accountMenuIcon).click()
        cy.get(selectors.accountMenuItems)
            .contains('Sign Out')
            .click();
        return cy.get(selectors.accountMenuItems).contains('Sign In');
    }

    /** Create an address that is used with other tests */
    static createAddress(customerInfo) {
        cy.visit(account.routes.accountAddAddress);
        cy.get(selectors.addAddressFormSelector).then(($form) => {
            if ($form.find(selectors.defaultShippingAddress).length) {
                cy.get(selectors.defaultBillingAddress).check();
                cy.get(selectors.defaultShippingAddress).check();
            }
            cy.get(selectors.newAddressStreetInput).type(customerInfo.streetAddressStreet);
            cy.get(selectors.newAddressHouseNumberInput).type(customerInfo.streetAddressNumber);
            cy.get(selectors.newAddressCityInput).type(customerInfo.city);
            cy.get(selectors.newAddressTelInput).type(customerInfo.phone);
            cy.get(selectors.newAddressZipcodeInput).type(customerInfo.zip);
            cy.get(selectors.newAddressCountryInput).select(customerInfo.country);
            cy.get(selectors.newAddressRegionInput).type(customerInfo.state);
            cy.contains('Save Address').click();
        });
    }

    static addItemToWishlist(itemUrl = '') {
        cy.visit(itemUrl);
        cy.get(productSelectors.addToWishlistButton).click();
    }
}
