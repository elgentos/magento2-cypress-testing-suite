import {Account} from '../../../page-objects/luma/account'
import account from '../../../fixtures/account'
import product from '../../../fixtures/luma/product'
import checkout from '../../../fixtures/checkout'
import selectorsLuma from '../../../fixtures/luma/selectors/account'
import checkoutSelectors from '../../../fixtures/luma/selectors/checkout'
import {shouldHaveSuccessMessage} from '../../../support/utils'

describe('Account test creation', () => {
    it('Can create an account', () => {
        cy.visit(account.routes.accountCreate)
        Account.createNewCustomer(account.customer.customer.firstname, account.customer.customer.lastname, Date.now() + account.customer.customer.email, account.customer.password)
        cy.contains('Thank you for registering with').should('exist')
    })
})

describe('Account activities', () => {
    beforeEach(() => {
        Account.ensureLoggedIn(account.customer.customer.email, account.customer.password)
    })

    it('Can check your profile', () => {
        cy.visit(account.routes.accountEdit)
        Account.checkAllProfileSpecs()
    })

    it('Can change password', () => {
        cy.visit(account.routes.accountEdit)
        cy.get('#change-password').check({force: true})
        cy.contains('Current Password').should('be.visible')
        cy.contains('New Password').should('be.visible')
        Account.changePassword(account.customer.password, account.tempCustomerInfo.password)
        cy.contains('You saved the account information.').should('exist')
        Account.login(account.customer.customer.email, account.tempCustomerInfo.password)
        cy.visit(account.routes.accountEdit)
        // Change password back to normal
        cy.get('#change-password').check({force: true})
        Account.changePassword(account.tempCustomerInfo.password, account.customer.password)
        cy.contains('You saved the account information.').should('exist')
    })

    it('Can change the profile values', () => {
        let fn = account.tempCustomerInfo.firstname,
            ln = account.tempCustomerInfo.lastname
        cy.visit(account.routes.accountEdit)
        Account.changeProfileValues(account.tempCustomerInfo.firstname, account.tempCustomerInfo.lastname)
        Account.goToProfile()
        cy.get(selectorsLuma.accountFirstnameInputSelector).should('have.value', fn)
        cy.get(selectorsLuma.accountLastnameInputSelector).should('have.value', ln)
        cy.visit(account.routes.accountEdit).then(() => {
            let fn = account.customer.customer.firstname,
                ln = account.customer.customer.lastname
            Account.changeProfileValues(fn, ln)
            cy.visit(account.routes.accountEdit).then(() => {
                cy.get(selectorsLuma.accountFirstnameInputSelector).should('have.value', fn)
                cy.get(selectorsLuma.accountLastnameInputSelector).should('have.value', ln)
            })
        })
    })

    it('Can view order history', () => {
        // Testing the link has already been done
        cy.visit(account.routes.accountOrderHistory)
        cy.get('#maincontent .column.main').then(($column) => {
            if ($column[0].querySelector('.order-products-toolbar p span')) {
                cy.log($column.find('.order-products-toolbar p span').text())
                expect(+$column[0].querySelector('.order-products-toolbar p span').innerText.trim().slice(0, 1)).to.be.at.least(1)
            } else {
                cy.contains('You have placed no orders.').should('exist')
            }
        })
    })

    it('Can add an address', () => {
        cy.visit(account.routes.accountAddresses)
        cy.wait(5000) // For whatever reason, clicks on the damn button don't work until all the things™ are loaded.
        cy.get(selectorsLuma.addNewAddressButton)
            .contains('Add New Address')
            .click()
        cy.get('h1.page-title')
            .contains('Add New Address')
            .should('exist')
        Account.createAddress(account.customerInfo, false)
    })

    it('Can change an address', () => {
        cy.intercept('**/customer/section/load/?*')
            .as('stateRequest')

        Account.createAddress(account.customerInfo, false)

        const timeStamp = Date.now().toString()
        cy.visit(account.routes.accountAddresses)
        cy.get(selectorsLuma.editAddress).first().click()
        cy.get(selectorsLuma.addressEditStreetInput).eq(0).type(timeStamp + 'street')
        cy.wait('@stateRequest')
        cy.get(selectorsLuma.saveAddressButton).contains('Save Address').click()
        cy.contains('You saved the address.').should('exist')
    })

    it('Can add an address automatically from saved address', () => {
        cy.intercept('**/rest/*/V1/carts/mine/estimate-shipping-methods-by-address-id')
            .as('estimateShippingWithAddress')

        Account.createAddress(account.customerInfo)
        // There needs to be an item in the cart for this to work, and there needs to be a saved address
        cy.visit(product.simpleProductUrl)
        cy.contains('Add to Cart').click()
        cy.visit(checkout.checkoutUrl)
        cy.wait('@estimateShippingWithAddress')
        cy.get(checkoutSelectors.addressSelected)
            .should('have.length', 1)
    })

    it('Can remove an address', () => {
        Account.createAddress(account.customerInfo)
        cy.visit('/customer/address')
        // For some reason, the delete button is only clickable after a while.
        // It looks like this is not related to any xhr request happening so cy.intercept won't do any good.
        cy.wait(1000)
        cy.get('.additional-addresses a.delete')
            .first()
            .click()
        cy.get('.modal-content').contains('Are you sure you want to delete this address?')
        cy.get('.action-primary')
            .first()
            .click()
    })

    it('Can change the newsletter subscription', () => {
        cy.visit(account.routes.manageNewsletter)
        cy.contains('General Subscription')
        cy.get('#subscription').should('be.checked')
    })

    it('Can add a product to the wishlist', () => {
        cy.intercept('**/customer/section/load/?*')
            .as('stateRequest')

        cy.visit(product.simpleProductUrl)
        cy.wait('@stateRequest')
        cy.contains('Add to Wish List')
            .click()
        shouldHaveSuccessMessage('has been added to your Wish List')
        cy.get(selectorsLuma.wishlistTitle)
            .should('contain.text', 'My Wish List')
            .should('exist')
        cy.visit(account.routes.wishlist).then(() => {
            cy.get('.toolbar-number').should('exist')
            cy.contains(product.simpleProductName).should('exist')
        })
    })

    it('Can log out', () => {
        cy.visit(account.routes.accountUrl)
        cy.wait(2000)
        Account.logout()
    })
})

describe('Guest user test', () => {
    beforeEach(() => {
        Account.ensureLoggedOut()
    })

    it('Can login from cart', () => {
        cy.visit(product.simpleProductUrl)
        cy.get(checkoutSelectors.addToCartButton).click()
        cy.wait(3000)
        cy.get(selectorsLuma.successMessageCartLink).contains('shopping cart').click()
        cy.visit(account.routes.accountIndex);
        cy.wait(4000)
        Account.login(account.customer.customer.email, account.customer.password)
        // If the login fails the test will still pass without this line
        cy.get(selectorsLuma.messageContents).should('not.exist')
        cy.get(checkoutSelectors.miniCartIcon).click()
        cy.get('#minicart-content-wrapper')
            .should('contain.text', 'Cart Subtotal')
        cy.contains(product.simpleProductName).should('exist')
    })

    it('Can login from checkout', () => {
        cy.intercept('**/rest/*/V1/customers/isEmailAvailable')
            .as('emailAvailable')
        cy.intercept('**/rest/*/V1/guest-carts/*/estimate-shipping-methods')
            .as('estimateShipping')
        cy.intercept('**/customer/ajax/login')
            .as('login')
        cy.intercept('**/rest/*/V1/carts/mine/estimate-shipping-methods-by-address-id')
            .as('estimateShippingWithAddress')

        cy.visit(product.simpleProductUrl)
        cy.get(checkoutSelectors.addToCartButton)
            .contains('Add to Cart')
            .click()
        cy.visit(checkout.checkoutUrl)
        cy.wait('@estimateShipping')
        cy.get(checkoutSelectors.checkoutEmailLabel).type(account.customer.customer.email)
        cy.wait('@emailAvailable')
        cy.get('.billing-address-form')
            .should('contain.text', 'You already have an account with us. Sign in or continue as guest.')
        cy.get(checkoutSelectors.checkoutPasswordInput)
            .type(`${account.customer.password}{enter}`)
        cy.wait('@login')
        cy.wait('@estimateShippingWithAddress')
        cy.get(checkoutSelectors.addressSelected).should('have.length', 1)
    })
})
