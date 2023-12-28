import selectors from '../../fixtures/luma/selectors/account'
import account from '../../fixtures/account'
import {isMobile} from "../../support/utils";

export class Account {
    static login(user, pw) {
        cy.visit(account.routes.accountIndex);
        cy.get('.base').then(($text) => {
            if ($text.text().indexOf('Customer Login') >= 0) {
        cy.get(selectors.loginEmailInputSelector).type(user)
        cy.get(selectors.loginPasswordInputSelector).type(`${pw}{enter}`)
    }
        })
    }

    static isLoggedIn() {
        cy.contains(selectors.myAccountHeaderSelector, 'My Account')
    }
    
    static logout() {
        cy.visit(account.routes.accountIndex);
        cy.get('.base').then(($text) => {
            if ($text.text().indexOf('My Account') >= 0) {
                if(isMobile()) {
                    cy.get('.nav-toggle').click()
                    cy.get('[aria-controls="store.links"]').click()
                } else {
                    cy.get('.page-header .customer-welcome > .customer-name > .action').click()
                }
                cy.contains('Sign Out').click({force: true})
            }
        })
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

    /** Create an address that is used with other tests */
    static createAddress(customerInfo) {
        cy.visit(account.routes.accountAddAddress)
        cy.get(selectors.addAddressFormSelector).then(($form) => {
            if ($form.find('#primary_billing').length) {
                cy.get('#primary_billing').check()
                cy.get('#primary_shipping').check()
            }
            cy.get(selectors.newAddressStreetInput).type(customerInfo.streetAddress)
            cy.get(selectors.newAddressCityInput).type(customerInfo.city)
            cy.get(selectors.newAddressTelInput).type(customerInfo.phone)
            cy.get(selectors.newAddressZipcodeInput).type(customerInfo.zip)
            cy.get(selectors.newAddressCountryInput).select(customerInfo.country)
            cy.get(selectors.newAddressRegionInput).select(customerInfo.state)
            cy.contains('Save Address').click()
        })
    }

    static deleteAddress() {
        cy.visit(account.routes.accountAddresses)
        cy.wait(4000)
        cy.get('.additional-addresses a.delete').eq(0).click({force: true})
        cy.wait(1000)
        cy.get('.modal-content').then(($modal) => {
            if ($modal.text().indexOf('Are you sure you want to delete this address?') >= 0) {
                cy.get('.action-primary').click()
                cy.wait(2500)
            }
        })
    }

    static addItemToWishlist(itemUrl = '') {
        cy.visit(itemUrl)
        cy.get('button[aria-label="Add to Wish List"]').click()
    }
}
