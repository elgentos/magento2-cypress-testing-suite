import {Account} from '../../../page-objects/luma/account'
import {Product} from '../../../page-objects/product'
import {Magento2RestApi} from '../../../support/magento2-rest-api'
import account from '../../../fixtures/account'
import product from '../../../fixtures/luma/product'
import selectorsLuma from '../../../fixtures/selectors/luma/account'
import checkoutSelectors from '../../../fixtures/selectors/luma/checkout'


describe('Account test creation', () => {
    it('Can create an account', () => {
        cy.visit(account.routes.accountCreate)
        Account.createNewCustomer(account.customer.customer.firstname, account.customer.customer.lastname, Date.now() + account.customer.customer.email, account.customer.password)
        cy.contains('Thank you for registering with Main Website Store.').should('exist')
    })
})

describe('Account activities', () => {
    beforeEach(() => {
        cy.wait(2500)
        cy.removeLocalStorage();
        cy.clearCookies();
        Account.login(account.customer.customer.email, account.customer.password)
        // If login fails the assertion is ignored without the wait(0)
        cy.wait(0)
        cy.contains('Please wait and try again later.').should('not.exist')
    })

    before(() => {
        cy.wait(2500)
        cy.removeLocalStorage();
        cy.clearCookies();
        Magento2RestApi.createCustomerAccount(account.customer)
        Account.login(account.customer.customer.email, account.customer.password)
        Account.createAddress(account.customerInfo)
        // We need to logout or the beforeEach will fail
        Account.logout()
        cy.wait(2500)
    })

    after(() => {
        // Remove the added address
        cy.wait(2500)
        cy.removeLocalStorage();
        cy.clearCookies();
        Account.login(account.customer.customer.email, account.customer.password)
        cy.visit('/customer/address')
        cy.wait(4000)
        cy.get('.additional-addresses a.delete').eq(0).click({force: true})
        cy.wait(1000)
        cy.get('.modal-content').contains('Are you sure you want to delete this address?')
        cy.get('.action-primary').click()
        cy.wait(2500)
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
        cy.wait(4000)
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
        cy.visit(account.routes.accountAddAddress)
        Account.createAddress(account.customerInfo)
        cy.wait(2000)
        cy.contains(selectorsLuma.addNewAddressButton, 'Add New Address').click()
        cy.get(selectorsLuma.newAddressStreetInput).type(account.customerInfo.streetAddress)
        cy.get(selectorsLuma.newAddressCityInput).type(account.customerInfo.city)
        cy.get(selectorsLuma.newAddressTelInput).type(account.customerInfo.phone)
        cy.get(selectorsLuma.newAddressZipcodeInput).type(account.customerInfo.zip)
        cy.get(selectorsLuma.newAddressCountryInput).select(account.customerInfo.country)
        cy.contains('Save Address').click()
    })

    it('Can change an address', () => {
        const timeStamp = Date.now().toString()
        cy.visit(account.routes.accountAddresses)
        cy.get(selectorsLuma.editAddress).first().click()
        cy.get(selectorsLuma.addressEditStreetInput).eq(0).type(timeStamp)
        cy.get(selectorsLuma.saveAddressButton).contains('Save Address').click()
        cy.contains('You saved the address.').should('exist')
    })

    it('Can add an address automatically from saved address', () => {
        // There needs to be an item in the cart for this to work, and there needs to be a saved address
        cy.visit(Product.routes.simpleProduct)
        cy.contains('Add to Cart').click()
        cy.wait(3000)
        cy.visit(Product.routes.checkout)
        cy.wait(7000) // this shouldn't be needed but for some reason it doesn't work without
        cy.get('.shipping-address-item.selected-item').should('have.length', 1)
    })

    it('Can remove an address', () => {
        Account.createAddress(account.customerInfo)
        cy.visit(account.routes.accountAddresses)
        cy.wait(4000)
        cy.get(selectorsLuma.deleteAddressButton).eq(0).click({force: true})
        // An confirm alert pops up asking if you are sure
        cy.contains('.modal-content', 'Are you sure you want to delete this address?')
        cy.get('.action-primary').click()
        cy.contains('You deleted the address.').should('exist')
    })

    it('Can change the newsletter subscription', () => {
        cy.visit(account.routes.manageNewsletter)
        cy.contains('General Subscription')
        cy.get('#subscription').should('be.checked')
    })

    it('Can add a product the a wishlist', () => {
        cy.visit(Product.routes.simpleProduct)
        cy.wait(2000)
        cy.get(selectorsLuma.addToWishlistButton).eq(0).click({force: true})
        cy.get(selectorsLuma.wishlistTitle).should('contain.text', 'My Wish List').should('exist')
        cy.visit(Product.routes.wishlist).then(() => {
            cy.get('.toolbar-number').should('exist')
            cy.contains(product.simpleProductName).should('exist')
        })
    })

    it('Can log out', () => {
        cy.get(selectorsLuma.accountIcon).click({force: true})
        cy.get(selectorsLuma.accountMenu).contains('Sign Out').click({force: true})
        cy.get(selectorsLuma.signedOutHeader).should('contain.text', 'You are signed out')
        cy.wait(2000)
    })
})

describe('Guest user test', () => {
    beforeEach(() => {
        cy.wait(2500)
        cy.removeLocalStorage();
        cy.clearCookies();
    })

    it('Can login from cart', () => {
        cy.visit(Product.routes.simpleProduct)
        cy.get(checkoutSelectors.addToCartButton).click()
        cy.wait(3000)
        cy.get(selectorsLuma.successMessageCartLink).contains('shopping cart').click()
        cy.visit(account.routes.accountIndex);
        cy.wait(4000)
        Account.login(account.customer.customer.email, account.customer.password)
        // If the login fails the test will still pass without this line
        cy.get(selectorsLuma.messageContents).should('not.exist')
        cy.get(checkoutSelectors.miniCartIcon).click()
        cy.get(checkoutSelectors.productQuantityField).and(($input) => {
            // Could pass when I should fail?
            expect($input[0].valueAsNumber).to.be.at.least(1)
        })
        cy.contains(product.simpleProductName).should('exist')
    })

    it('Can login from checkout', () => {
        cy.visit(Product.routes.simpleProduct)
        cy.wait(4000)
        cy.get(checkoutSelectors.addToCartButton).should('contain.text', 'Add to Cart').click()
        cy.visit(Product.routes.checkout)
        cy.wait(5000)
        cy.get(checkoutSelectors.checkoutEmailLabel).type(account.customer.customer.email)
        cy.wait(4000)
        cy.get(checkoutSelectors.checkoutPasswordLabel).type(account.customer.password)
        cy.wait(1000)
        cy.get('button[data-action="checkout-method-login"]').click()
    })
})
