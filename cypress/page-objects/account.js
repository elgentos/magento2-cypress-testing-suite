// Luma
import selectorsLuma from '../fixtures/selectors/luma/account'
import accountLuma from '../fixtures/luma/account'

// Hyva
import selectorsHyva from '../fixtures/selectors/hyva/account'
import accountHyva from '../fixtures/hyva/account'

export class Account {

    static login(user, pw) {
        if (Cypress.env('isLuma')) {
            cy.visit(accountLuma.routes.accountIndex);
            cy.get(selectorsLuma.loginEmailInputSelector).type(user)
            cy.get(selectorsLuma.loginPasswordInputSelector).type(`${pw}{enter}`)
        }

        if (Cypress.env('isHyva')) {
            cy.visit(accountHyva.routes.accountIndex);
            cy.get(selectorsHyva.loginEmailInputSelector).type(user)
            cy.get(selectorsHyva.loginPasswordInputSelector).type(`${pw}{enter}`)
        }

    }

    static isLoggedIn() {
        if (Cypress.env('isLuma')) {
            cy.contains(selectorsLuma.myAccountHeaderSelector, 'My Account')
        }

        if (Cypress.env('isHyva')) {
            cy.contains(selectorsHyva.myAccountHeaderSelector, 'My Account')
        }
    }

    static goToProfile() {
        if (Cypress.env('isLuma')) {
            cy.get('#block-collapsible-nav').contains('Account Information').click()
        }

        if (Cypress.env('isHyva')) {
            cy.contains('Account Information').click()
        }
    }

    static checkAllProfileSpecs() {
        if (Cypress.env('isLuma')) {
            cy.get(selectorsLuma.accountFirstnameInputSelector).should('be.visible')
            cy.get(selectorsLuma.accountLastnameInputSelector).should('be.visible')
            cy.contains('Change Email').should('be.visible').and('not.be.checked')
            cy.contains('Change Password').should('be.visible').and('not.be.checked')
        }

        if (Cypress.env('isHyva')) {
            cy.get(selectorsHyva.accountFirstnameInputSelector).should('be.visible')
            cy.get(selectorsHyva.accountLastnameInputSelector).should('be.visible')
            cy.contains('Change Email').should('be.visible').and('not.be.checked')
            cy.contains('Change Password').should('be.visible').and('not.be.checked')
        }
    }

    static changePassword(pwd, newPwd) {
        if (Cypress.env('isLuma')) {
            cy.get(selectorsLuma.changePasswordFormSelector).within(($from) => {
                cy.get(selectorsLuma.currentPasswordInputSelector).type(pwd)
                cy.get(selectorsLuma.newPasswordInputSelector).type(newPwd)
                cy.get(selectorsLuma.newPasswordConfirmationInputSelector).type(`${newPwd}{enter}`)
            })
        }

        if (Cypress.env('isHyva')) {
            cy.get(selectorsHyva.changePasswordFormSelector).within(($from) => {
                cy.contains('Change Password').click()
                cy.get(selectorsHyva.currentPasswordInputSelector).type(pwd)
                cy.get(selectorsHyva.newPasswordInputSelector).type(newPwd)
                cy.get(selectorsHyva.newPasswordConfirmationInputSelector).type(`${newPwd}{enter}`)
            })
        }
    }

    static changeProfileValues(fn, ln) {
        if (Cypress.env('isLuma')) {
            cy.get('#form-validate').within(($form) => {
                cy.get(selectorsLuma.accountFirstnameInputSelector).clear().type(fn)
                cy.get(selectorsLuma.accountLastnameInputSelector).clear().type(`${ln}{enter}`)
            })
            cy.window().then((w) => w.initial = true)
        }

        if (Cypress.env('isHyva')) {
            cy.get('#form-validate').within(($form) => {
                cy.get(selectorsHyva.accountFirstnameInputSelector).clear().type(fn)
                cy.get(selectorsHyva.accountLastnameInputSelector).clear().type(`${ln}{enter}`)
            })
            cy.window().then((w) => w.initial = true)
        }
    }

    static createNewCustomer(firstName, lastName, email, passwd) {
        if (Cypress.env('isLuma')) {
            cy.get(selectorsLuma.accountFirstnameInputSelector).type(firstName)
            cy.get(selectorsLuma.accountLastnameInputSelector).type(lastName)
            cy.get(selectorsLuma.accountEmailInputSelector).type(email)
            cy.get(selectorsLuma.newPasswordInputSelector).type(passwd)
            cy.get(selectorsLuma.newPasswordConfirmationInputSelector).type(passwd)
            cy.wait(2000)
            cy.get('.form-create-account button').click()
        }

        if (Cypress.env('isHyva')) {
            cy.get(selectorsHyva.accountFirstnameInputSelector).type(firstName)
            cy.get(selectorsHyva.accountLastnameInputSelector).type(lastName)
            cy.get(selectorsHyva.accountEmailInputSelector).type(email)
            cy.get(selectorsHyva.newPasswordInputSelector).type(passwd)
            cy.get(selectorsHyva.newPasswordConfirmationInputSelector).type(`${passwd}{enter}`)
        }
    }

    static logout() {
        if (Cypress.env('isLuma')) {
            cy.get('.items > :nth-child(1) > a').click()
            cy.wait(4000)
            cy.get(':nth-child(2) > .customer-welcome > .customer-name > .action').click()
            cy.contains('Sign Out').click()
        }

        if (Cypress.env('isHyva')) {
            cy.get('[aria-label="My Account"]').click()
            cy.get('[aria-labelledby="customer-menu"]').contains('Sign Out').click()
        }
    }

    /** Create an address that is used with other tests */
    static createAddress(customerInfo) {
        if (Cypress.env('isLuma')) {
            cy.visit(accountLuma.routes.accountAddAddress)
            cy.get(selectorsLuma.addAddressFormSelector).then(($form) => {
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

        if (Cypress.env('isHyva')) {
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
    }

    static addItemToWishlist(itemUrl = '') {
        if (Cypress.env('isLuma')) {
            cy.visit(itemUrl)
            cy.get('button[aria-label="Add to Wish List"]').click()
        }

        if (Cypress.env('isHyva')) {
            cy.visit(itemUrl)
            cy.get('button[aria-label="Add to Wish List"]').click()
        }
    }
}
