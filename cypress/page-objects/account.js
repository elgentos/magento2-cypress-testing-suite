<<<<<<< HEAD
import selectors from "../fixtures/selectors/hyva/account";
import productSelectors from "../fixtures/selectors/hyva/product";
import account from "../fixtures/account";
=======
import selectors from '../fixtures/selectors/hyva/account'
import account from '../fixtures/account'
>>>>>>> e99916131eeb042ad422d2aee6cd7a535ec9a530

export class Account {
    static login(user, pw) {
        cy.visit(account.routes.accountIndex);
<<<<<<< HEAD
        cy.get(selectors.loginEmailInputSelector).type(user);
        cy.get(selectors.loginPasswordInputSelector).type(`${pw}{enter}`);
    }

    static isLoggedIn() {
        cy.contains(selectors.myAccountHeaderSelector, "My Account");
    }

    static goToProfile() {
        cy.contains("Account Information").click();
    }

    static checkAllProfileSpecs() {
        cy.get(selectors.accountFirstnameInputSelector).should("be.visible");
        cy.get(selectors.accountLastnameInputSelector).should("be.visible");
        cy.contains("Change Email").should("be.visible").and("not.be.checked");
        cy.contains("Change Password")
            .should("be.visible")
            .and("not.be.checked");
=======
        cy.get(selectors.loginEmailInputSelector).type(user)
        cy.get(selectors.loginPasswordInputSelector).type(`${pw}{enter}`)
    }

    static isLoggedIn() {
        cy.contains(selectors.myAccountHeaderSelector, 'My Account')
    }

    static goToProfile() {
        cy.contains('Account Information').click()
    }

    static checkAllProfileSpecs() {
        cy.get(selectors.accountFirstnameInputSelector).should('be.visible')
        cy.get(selectors.accountLastnameInputSelector).should('be.visible')
        cy.contains('Change Email').should('be.visible').and('not.be.checked')
        cy.contains('Change Password').should('be.visible').and('not.be.checked')
>>>>>>> e99916131eeb042ad422d2aee6cd7a535ec9a530
    }

    static changePassword(pwd, newPwd) {
        cy.get(selectors.changePasswordFormSelector).within(($from) => {
<<<<<<< HEAD
            cy.contains("Change Password").click();
            cy.get(selectors.currentPasswordInputSelector).type(pwd);
            cy.get(selectors.newPasswordInputSelector).type(newPwd);
            cy.get(selectors.newPasswordConfirmationInputSelector).type(
                `${newPwd}{enter}`
            );
        });
    }

    static changeProfileValues(fn, ln) {
        cy.get("#form-validate").within(($form) => {
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
        cy.get('[aria-label="My Account"]').click();
        cy.get('[aria-labelledby="customer-menu"]')
            .contains("Sign Out")
            .click();
=======
            cy.contains('Change Password').click()
            cy.get(selectors.currentPasswordInputSelector).type(pwd)
            cy.get(selectors.newPasswordInputSelector).type(newPwd)
            cy.get(selectors.newPasswordConfirmationInputSelector).type(`${newPwd}{enter}`)
        })
    }

    static changeProfileValues(fn, ln) {
        cy.get('#form-validate').within(($form) => {
            cy.get(selectors.accountFirstnameInputSelector).clear().type(fn)
            cy.get(selectors.accountLastnameInputSelector).clear().type(`${ln}{enter}`)
        })
        cy.window().then((w) => w.initial = true)
    }

    static createNewCustomer(firstName, lastName, email, passwd) {
        cy.get(selectors.accountFirstnameInputSelector).type(firstName)
        cy.get(selectors.accountLastnameInputSelector).type(lastName)
        cy.get(selectors.accountEmailInputSelector).type(email)
        cy.get(selectors.newPasswordInputSelector).type(passwd)
        cy.get(selectors.newPasswordConfirmationInputSelector).type(`${passwd}{enter}`)
    }

    static logout() {
        cy.get('[aria-label="My Account"]').click()
        cy.get('[aria-labelledby="customer-menu"]').contains('Sign Out').click()
>>>>>>> e99916131eeb042ad422d2aee6cd7a535ec9a530
    }

    /** Create an address that is used with other tests */
    static createAddress(customerInfo) {
<<<<<<< HEAD
        cy.visit(account.routes.accountAddAddress);
        cy.get(selectors.addAddressFormSelector).then(($form) => {
            if ($form.find("#primary_billing").length) {
                cy.get("#primary_billing").check();
                cy.get("#primary_shipping").check();
            }
            cy.get("#street_1").type(customerInfo.streetAddress);
            cy.get("#city").type(customerInfo.city);
            cy.get("#telephone").type(customerInfo.phone);
            cy.get("#zip").type(customerInfo.zip);
            cy.get("#country").select(customerInfo.country);
            cy.get("#region").type(customerInfo.state);
            cy.contains("Save Address").click();
        });
    }

    static addItemToWishlist(itemUrl) {
        cy.visit(itemUrl);
        cy.get(productSelectors.addToWishlistButton).click();
=======
        cy.visit(account.routes.accountAddAddress)
        cy.get(selectors.addAddressFormSelector).then(($form) => {
            if ($form.find('#primary_billing').length) {
                cy.get('#primary_billing').check()
                cy.get('#primary_shipping').check()
            }
            cy.get('#street_1').type(customerInfo.streetAddress)
            cy.get('#city').type(customerInfo.city)
            cy.get('#telephone').type(customerInfo.phone)
            cy.get('#zip').type(customerInfo.zip)
            cy.get('#country').select(customerInfo.country)
            cy.get('#region').type(customerInfo.state)
            cy.contains('Save Address').click()
        })
    }

    static addItemToWishlist(itemUrl = '') {
        cy.visit(itemUrl)
        cy.get('button[aria-label="Add to Wish List"]').click()
>>>>>>> e99916131eeb042ad422d2aee6cd7a535ec9a530
    }
}
