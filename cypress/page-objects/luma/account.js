import selectors from '../../fixtures/luma/selectors/account'
import account from '../../fixtures/account'
import {isMobile} from "../../support/utils";

export class Account {
    static login(user, pw) {
        cy.visit(account.routes.accountIndex);
        cy.get(selectors.loginEmailInputSelector).type(user)
        cy.get(selectors.loginPasswordInputSelector).type(`${pw}{enter}`)
    }

    static isLoggedIn() {
        cy.contains(selectors.myAccountHeaderSelector, 'My Account')
    }

    static goToProfile() {
        if(isMobile()) {
            cy.get('.sidebar-main > .block > .title').click()
        }
        cy.get('#block-collapsible-nav').contains('Account Information').click()
    }

    static checkAllProfileSpecs() {
        cy.get(selectors.accountFirstnameInputSelector).should('be.visible')
        cy.get(selectors.accountLastnameInputSelector).should('be.visible')
        cy.contains('Change Email').should('be.visible').and('not.be.checked')
        cy.contains('Change Password').should('be.visible').and('not.be.checked')
    }

    static changePassword(pwd, newPwd) {
        cy.get(selectors.changePasswordFormSelector).within(($from) => {
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
        cy.get(selectors.newPasswordConfirmationInputSelector).type(passwd)
        cy.wait(3000)
        cy.get('.form-create-account button').click()
    }

    static logout() {
        if(isMobile()) {
            cy.get('.nav-toggle').click()
            cy.get('[aria-controls="store.links"]').click()
        } else {
            cy.get('.page-header .customer-welcome > .customer-name > .action').click()
        }
        cy.contains('Sign Out').click({force: true})
    }

    /** Create an address that is used with other tests */
    static createAddress(customerInfo) {
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
            cy.contains('Save Address').click()
        })
    }

    static addItemToWishlist(itemUrl = '') {
        cy.visit(itemUrl)
        cy.get('button[aria-label="Add to Wish List"]').click()
    }
}
