export class Account {
    /** Routes **/
    static routes = {
        accountIndexRoute: '/customer/account/index/',
        accountEditRoute: '/customer/account/edit/',
        accountCreateRoute: '/customer/account/create/',
        accountOrderHistory: '/sales/order/history',
        accountAddAddress: '/customer/address/new'
    };

    /** Selectors **/
    static elements = {
        changePasswordFormSelector: '#form-validate',
        addAddressFormSelector: '#form-validate',
        accountFirstnameInputSelector: '#firstname',
        accountLastnameInputSelector: '#lastname',
        currentPasswordInputSelector: '#current-password',
        newPasswordInputSelector: '#password',
        newPasswordConfirmationInputSelector: '#password-confirmation',
        accountEmailInputSelector: '#email_address',
        loginEmailInputSelector: '#email',
        loginPasswordInputSelector: '#pass',
        myAccountHeaderSelector: '[data-ui-id="page-title-wrapper"]',
        defaultBillingAddress: '#primary_billing',
        defaultShippingAddress: '#primary_shipping',
    };

    static login(user, pw) {
        cy.visit(this.routes.accountIndexRoute);
        cy.get(this.elements.loginEmailInputSelector).type(user)
        cy.get(this.elements.loginPasswordInputSelector).type(`${pw}{enter}`)
    }

    static isLoggedIn() {
        cy.contains(this.elements.myAccountHeaderSelector, 'My Account')
    }

    static goToProfile() {
        cy.contains('Account Information').click()
    }

    static checkAllProfileSpecs() {
        cy.get(this.elements.accountFirstnameInputSelector).should('be.visible')
        cy.get(this.elements.accountLastnameInputSelector).should('be.visible')
        cy.contains('Change Email').should('be.visible').and('not.be.checked')
        cy.contains('Change Password').should('be.visible').and('not.be.checked')
    }

    static changePassword(pwd, newPwd) {
        cy.get(this.elements.changePasswordFormSelector).within(($from) => {
            cy.contains('Change Password').click()
            cy.get(this.elements.currentPasswordInputSelector).type(pwd)
            cy.get(this.elements.newPasswordInputSelector).type(newPwd)
            cy.get(this.elements.newPasswordConfirmationInputSelector).type(newPwd + '{enter}')
        })
    }

    static changeProfileValues(fn, ln) {
        cy.get('#form-validate').within(($form) => {
            cy.get(this.elements.accountFirstnameInputSelector).clear().type(fn)
            cy.get(this.elements.accountLastnameInputSelector).clear().type(`${ln}{enter}`)
        })
        cy.window().then((w) => w.initial = true)
    }

    static createNewCustomer(firstName, lastName, email, passwd) {
        cy.get(this.elements.accountFirstnameInputSelector).type(firstName)
        cy.get(this.elements.accountLastnameInputSelector).type(lastName)
        cy.get(this.elements.accountEmailInputSelector).type(email)
        cy.get(this.elements.newPasswordInputSelector).type(passwd)
        cy.get(this.elements.newPasswordConfirmationInputSelector).type(`${passwd}{enter}`)
    }

    static logout() {
        cy.get('[aria-label="My Account"]').click()
        cy.get('[aria-labelledby="customer-menu"]').contains('Sign Out').click()
    }

    /** Create an address that is used with other tests */
    static createAddress(customerInfo) {
        cy.visit(this.routes.accountAddAddress)
        cy.get(this.elements.addAddressFormSelector).then(($form) => {
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
    }
}
