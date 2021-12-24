import {Account} from '../../page-objects/account'
import {Product} from '../../page-objects/product'
import {Magento2RestApi} from '../../support/magento2-rest-api'
import account from '../../fixtures/account'
import product from '../../fixtures/product'

const customerEmail = '1639058083628test@cypress-testing.com' // Date.now() + account.customer.customer.email

describe('Account test creation', () => {
    it('Can create an account', () => {
        cy.visit(Account.routes.accountCreateRoute)
        Account.createNewCustomer(account.customer.customer.firstname, account.customer.customer.lastname, Date.now() + account.customer.customer.email, account.customer.password)
        cy.contains('Thank you for registering with Main Website Store.').should('exist')
    })
})

describe('Account activities', () => {
    before(() => {
        // This no longer seems to work...
        Magento2RestApi.createCustomerAccount(account.customer)
        Account.login(account.customer.customer.email, account.customer.password)
        Account.createAddress(account.customerInfo)
        // We need to logout or the beforeEach will fail
        Account.logout()
    })

    beforeEach(() => {
        Account.login(account.customer.customer.email, account.customer.password)
        // If login fails the assertion is ignored without the wait(0)
        cy.wait(0)
        cy.contains('Please wait and try again later.').should('not.exist')

    })

    after(() => {
        // Remove the added address
        Account.login(account.customer.customer.email, account.customer.password)
        cy.visit('/customer/address')
        cy.get('a.delete').eq(0).click()
        cy.on('window:confirm', (str) => {
            expect(str.trim()).to.eq('Are you sure you want to delete this address?')
            return true
        })
    })

    it('Can use API to login',() => {
        // As of yet quite useless
        Magento2RestApi.logCustomerIn(account.customerLogin)
    })

    it('Can check your profile', () => {
        cy.visit(Account.routes.accountEditRoute)
        Account.checkAllProfileSpecs()
    })

    it('Can change password', () => {
        cy.visit(Account.routes.accountEditRoute)
        cy.contains('Change Password').click()
        cy.contains('Current Password').should('be.visible')
        cy.contains('New Password').should('be.visible')
        cy.contains('Change Password').click()
        Account.changePassword(account.customer.password, account.tempCustomerInfo.password)
        cy.contains('You saved the account information.').should('exist')
        Account.login(account.customer.customer.email, account.tempCustomerInfo.password)
        cy.visit(Account.routes.accountEditRoute)
        // Change password back to normal
        Account.changePassword(account.tempCustomerInfo.password, account.customer.password)
        cy.contains('You saved the account information.').should('exist')
    })

    it('Change the profile values', () => {
        let fn = account.tempCustomerInfo.firstname,
            ln = account.tempCustomerInfo.lastname
        cy.visit(Account.routes.accountEditRoute)
        Account.changeProfileValues(account.tempCustomerInfo.firstname, account.tempCustomerInfo.lastname)
        Account.goToProfile()
        cy.get(Account.elements.accountFirstnameInputSelector).should('have.value', fn)
        cy.get(Account.elements.accountLastnameInputSelector).should('have.value', ln)
        cy.visit(Account.routes.accountEditRoute).then(() => {
            let fn = account.customer.customer.firstname,
                ln = account.customer.customer.lastname
            Account.changeProfileValues(fn, ln)
            cy.visit(Account.routes.accountEditRoute).then(() => {
                cy.get(Account.elements.accountFirstnameInputSelector).should('have.value', fn)
                cy.get(Account.elements.accountLastnameInputSelector).should('have.value', ln)
            })
        })
    })

    it.only('can view order history', () => {
        // Testing the link has already been done
        cy.visit(Account.routes.accountOrderHistory)
        cy.get('#maincontent .column.main').then(($column) => {
            if ($column[0].querySelector('.order-products-toolbar p span')) {
                cy.log($column.find('.order-products-toolbar p span').text())
                expect(+$column[0].querySelector('.order-products-toolbar p span').innerText.trim().slice(0,1)).to.be.at.least(1)
            } else {
                cy.contains('You have placed no orders.').should('exist')
            }
        })
    })

    it('can add an address', () => {
        cy.visit(Account.routes.accountAddAddress)
        Account.createAddress(account.customerInfo)
        cy.contains('.actions-toolbar span', 'Add New Address').click()
        cy.get('#street_1').type(account.customerInfo.streetAddress)
        cy.get('#city').type(account.customerInfo.city)
        cy.get('#telephone').type(account.customerInfo.phone)
        cy.get('#zip').type(account.customerInfo.zip)
        cy.get('#country').select(account.customerInfo.country)
        cy.get('#region').type(account.customerInfo.state)
        cy.get('#primary_billing').check()
        cy.get('#primary_shipping').check()
        cy.contains('Save Address').click()
    })

    it('can change an address',  () => {
        const timeStamp = Date.now().toString()
        cy.visit('/customer/address')
        cy.get('.block-addresses-list a[title="Edit"]').first().click()
        cy.get('input[id^="street"]').eq(0).type(timeStamp)
        cy.contains('Save Address').click()
        cy.contains('You saved the address.').should('exist')
    })

    it('can remove an address', () => {
        cy.visit('/customer/address')
        cy.get('a.delete').eq(0).click()
        // An confirm alert pops up asking if you are sure
        cy.on('window:confirm', (str) => {
            expect(str.trim()).to.eq('Are you sure you want to delete this address?')
            return true
        })
        cy.contains('You deleted the address.').should('exist')
    })

    it('can change the newsletter subscription', () => {
        cy.visit('/newsletter/manage/')
        cy.contains('General Subscription').click()
        cy.get('#subscription').should('be.checked')
    })

    it('can add en address automatically from saved address\'', () => {
        // There needs to be an item in the cart for this to work, and there needs to be a saved address
        cy.visit(Product.routes.simpleProduct)
        cy.contains('Add to Cart').click()
        cy.visit(Product.routes.checkout).then(() => {
            cy.get('.shipping-address-item').should('have.length.above', 0)
            cy.contains('New Address').should('exist')
        })
    })

    it('can add a product the a wishlist', () => {
        cy.visit(Product.routes.simpleProduct)
        cy.get('[aria-label="store logo"]').click()
        cy.get('button[aria-label="Add to Wish List"]').eq(0).click()
        cy.contains('My Wish List').should('exist')
        cy.visit(Product.routes.wishlist)
        cy.contains('.toolbar-number', ' Item').should('exist')
    })

    it('can edit the wishlist', () => {
        // Add comment/check qtty/send list/remove item
        cy.visit(Product.routes.wishlist)
        cy.get('[id^="product-item-comment"]').first().type('foobar')
        cy.contains('Update Wish List').click()
        cy.get('[id^="product-item-comment"]').should("contain.text", 'foobar')
        cy.get('.form-input.qty').first().then(($qty) => {
            // you would actually be sure that you are counting the item you just added
            expect($qty[0].valueAsNumber).to.be.at.least(1)
        })
        cy.contains('button span', 'Share Wish List').click()
        cy.contains('h1 span', 'Wish List Sharing').should('exist')
        cy.contains('Back').click()
        cy.get('[title="Remove Item"]').first().click()
        cy.contains('has been removed from your Wish List.').should('exist')
    })

    it('can log out', () => {
        cy.get('[aria-label="My Account"]').click()
        cy.get('[aria-labelledby="customer-menu"]').contains('Sign Out').click()
        cy.get('.base').should('contain', 'You have signed out')
    })
})

describe('Do not login before these tests', () => {
    it('can login from cart without changes to cart', () => {
        cy.visit(Product.routes.simpleProduct)
        cy.contains('Add to Cart').click()
        cy.contains('a', 'shopping cart').click()
        Account.login(account.customer.customer.email, account.customer.password)
        cy.get('#menu-cart-icon').click()
        // If the login fails the test will still succeed without this line
        cy.contains('.message span', 'The account sign-in was incorrect or your account is disabled temporarily. Please wait and try again later.').should('not.exist')
        cy.contains('View and Edit Cart').click()
        cy.wait(5000)
        cy.get('[id^="qty-"').and(($input) => {
            expect(parseInt($input[0].value)).to.be.at.least(1)
        })
        cy.contains(product.products.simpleProductName).should('exist')
    })
})
