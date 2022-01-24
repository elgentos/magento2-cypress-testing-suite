import {Account} from '../../page-objects/account'
import {Product} from '../../page-objects/product'
import {Magento2RestApi} from '../../support/magento2-rest-api'

// Luma imports
import accountLuma from '../../fixtures/luma/account'
import productLuma from '../../fixtures/luma/product'
import selectorsLuma from '../../fixtures/selectors/luma/account'
import checkoutSelectorsLuma from '../../fixtures/selectors/luma/checkout'

// Hyva imports
import accountHyva from '../../fixtures/hyva/account'
import productHyva from '../../fixtures/hyva/product'
import selectorsHyva from '../../fixtures/selectors/hyva/account'
import checkoutSelectorsHyva from '../../fixtures/selectors/hyva/checkout'

// Luma tests
if (Cypress.env('isLuma')) {
    describe('Account test creation', () => {
        it('Can create an account', () => {
            cy.visit(accountLuma.routes.accountCreate)
            Account.createNewCustomer(accountLuma.customer.customer.firstname, accountLuma.customer.customer.lastname, Date.now() + accountLuma.customer.customer.email, accountLuma.customer.password)
            cy.contains('Thank you for registering with Main Website Store.').should('exist')
        })
    })

    describe('Account activities', () => {
        beforeEach(() => {
            cy.wait(2500)
            cy.removeLocalStorage();
            cy.clearCookies();
            Account.login(accountLuma.customer.customer.email, accountLuma.customer.password)
            // If login fails the assertion is ignored without the wait(0)
            cy.wait(0)
            cy.contains('Please wait and try again later.').should('not.exist')
        })

        before(() => {
            cy.wait(2500)
            cy.removeLocalStorage();
            cy.clearCookies();
            Magento2RestApi.createCustomerAccount(accountLuma.customer)
            Account.login(accountLuma.customer.customer.email, accountLuma.customer.password)
            Account.createAddress(accountLuma.customerInfo)
            // We need to logout or the beforeEach will fail
            Account.logout()
            cy.wait(2500)
        })

        after(() => {
            // Remove the added address
            cy.wait(2500)
            cy.removeLocalStorage();
            cy.clearCookies();
            Account.login(accountLuma.customer.customer.email, accountLuma.customer.password)
            cy.visit('/customer/address')
            cy.wait(4000)
            cy.get('.additional-addresses a.delete').eq(0).click({force: true})
            cy.wait(1000)
            cy.get('.modal-content').contains('Are you sure you want to delete this address?')
            cy.get('.action-primary').click()
            cy.wait(2500)
        })

        it('Can check your profile', () => {
            cy.visit(accountLuma.routes.accountEdit)
            Account.checkAllProfileSpecs()
        })

        it('Can change password', () => {
            cy.visit(accountLuma.routes.accountEdit)
            cy.get('#change-password').check({force: true})
            cy.contains('Current Password').should('be.visible')
            cy.contains('New Password').should('be.visible')
            Account.changePassword(accountLuma.customer.password, accountLuma.tempCustomerInfo.password)
            cy.contains('You saved the account information.').should('exist')
            Account.login(accountLuma.customer.customer.email, accountLuma.tempCustomerInfo.password)
            cy.visit(accountLuma.routes.accountEdit)
            // Change password back to normal
            cy.get('#change-password').check({force: true})
            Account.changePassword(accountLuma.tempCustomerInfo.password, accountLuma.customer.password)
            cy.contains('You saved the account information.').should('exist')
        })

        it('Can change the profile values', () => {
            let fn = accountLuma.tempCustomerInfo.firstname,
                ln = accountLuma.tempCustomerInfo.lastname
            cy.visit(accountLuma.routes.accountEdit)
            Account.changeProfileValues(accountLuma.tempCustomerInfo.firstname, accountLuma.tempCustomerInfo.lastname)
            cy.wait(4000)
            Account.goToProfile()
            cy.get(selectorsLuma.accountFirstnameInputSelector).should('have.value', fn)
            cy.get(selectorsLuma.accountLastnameInputSelector).should('have.value', ln)
            cy.visit(accountLuma.routes.accountEdit).then(() => {
                let fn = accountLuma.customer.customer.firstname,
                    ln = accountLuma.customer.customer.lastname
                Account.changeProfileValues(fn, ln)
                cy.visit(accountLuma.routes.accountEdit).then(() => {
                    cy.get(selectorsLuma.accountFirstnameInputSelector).should('have.value', fn)
                    cy.get(selectorsLuma.accountLastnameInputSelector).should('have.value', ln)
                })
            })
        })

        it('Can view order history', () => {
            // Testing the link has already been done
            cy.visit(accountLuma.routes.accountOrderHistory)
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
            cy.visit(accountLuma.routes.accountAddAddress)
            Account.createAddress(accountLuma.customerInfo)
            cy.wait(2000)
            cy.contains(selectorsLuma.addNewAddressButton, 'Add New Address').click()
            cy.get(selectorsLuma.newAddressStreetInput).type(accountLuma.customerInfo.streetAddress)
            cy.get(selectorsLuma.newAddressCityInput).type(accountLuma.customerInfo.city)
            cy.get(selectorsLuma.newAddressTelInput).type(accountLuma.customerInfo.phone)
            cy.get(selectorsLuma.newAddressZipcodeInput).type(accountLuma.customerInfo.zip)
            cy.get(selectorsLuma.newAddressCountryInput).select(accountLuma.customerInfo.country)
            cy.contains('Save Address').click()
        })

        it('Can change an address', () => {
            const timeStamp = Date.now().toString()
            cy.visit(accountLuma.routes.accountAddresses)
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
            Account.createAddress(accountLuma.customerInfo)
            cy.visit(accountLuma.routes.accountAddresses)
            cy.wait(4000)
            cy.get(selectorsLuma.deleteAddressButton).eq(0).click({force: true})
            // An confirm alert pops up asking if you are sure
            cy.contains('.modal-content', 'Are you sure you want to delete this address?')
            cy.get('.action-primary').click()
            cy.contains('You deleted the address.').should('exist')
        })

        it('Can change the newsletter subscription', () => {
            cy.visit(accountLuma.routes.manageNewsletter)
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
                cy.contains(productLuma.simpleProductName).should('exist')
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
            cy.get(checkoutSelectorsLuma.addToCartButton).click()
            cy.wait(3000)
            cy.get(selectorsLuma.successMessageCartLink).contains('shopping cart').click()
            cy.visit(accountLuma.routes.accountIndex);
            cy.wait(4000)
            Account.login(accountLuma.customer.customer.email, accountLuma.customer.password)
            // If the login fails the test will still pass without this line
            cy.get(selectorsLuma.messageContents).should('not.exist')
            cy.get(checkoutSelectorsLuma.miniCartIcon).click()
            cy.get(checkoutSelectorsLuma.productQuantityField).and(($input) => {
                // Could pass when I should fail?
                expect($input[0].valueAsNumber).to.be.at.least(1)
            })
            cy.contains(productLuma.simpleProductName).should('exist')
        })

        it('Can login from checkout', () => {
            cy.visit(Product.routes.simpleProduct)
            cy.wait(4000)
            cy.get(checkoutSelectorsLuma.addToCartButton).should('contain.text', 'Add to Cart').click()
            cy.visit(Product.routes.checkout)
            cy.wait(5000)
            cy.get(checkoutSelectorsLuma.checkoutEmailLabel).type(accountLuma.customer.customer.email)
            cy.wait(4000)
            cy.get(checkoutSelectorsLuma.checkoutPasswordLabel).type(accountLuma.customer.password)
            cy.wait(1000)
            cy.get('button[data-action="checkout-method-login"]').click()
        })
    })
}

// Hyva tests
if (Cypress.env('isHyva')) {
    describe('Account test creation', () => {
        it('Can create an account', () => {
            cy.visit(accountHyva.routes.accountCreate)
            Account.createNewCustomer(accountHyva.customer.customer.firstname, accountHyva.customer.customer.lastname, Date.now() + accountHyva.customer.customer.email, accountHyva.customer.password)
            cy.contains('Thank you for registering with Main Website Store.').should('exist')
        })
    })

    describe('Account activities', () => {
        before(() => {
            // This no longer seems to work...
            Magento2RestApi.createCustomerAccount(accountHyva.customer)
            Account.login(accountHyva.customer.customer.email, accountHyva.customer.password)
            Account.createAddress(accountHyva.customerInfo)
            // We need to logout or the beforeEach will fail
            Account.logout()
        })

        beforeEach(() => {
            Account.login(accountHyva.customer.customer.email, accountHyva.customer.password)
            // If login fails the assertion is ignored without the wait(0)
            cy.wait(0)
            cy.contains('Please wait and try again later.').should('not.exist')

        })

        after(() => {
            // Remove the added address
            cy.get('#maincontent').then(($mainContent) => {
                if (
                    $mainContent[0].querySelector('h1') &&
                    $mainContent[0].querySelector('h1').innerText.trim() !== "My Account"
                ) {
                    Account.login(accountHyva.customer.customer.email, accountHyva.customer.password)
                }
            })
            cy.visit('/customer/address')
            cy.get('a.delete').eq(0).click()
            cy.on('window:confirm', (str) => {
                expect(str.trim()).to.eq('Are you sure you want to delete this address?')
                return true
            })
        })

        it('Can use API to login',() => {
            // @TODO As of yet quite useless
            Magento2RestApi.logCustomerIn(accountHyva.customerLogin)
        })

        it('Can check your profile', () => {
            cy.visit(accountHyva.routes.accountEdit)
            Account.checkAllProfileSpecs()
        })

        it('Can change password', () => {
            cy.visit(accountHyva.routes.accountEdit)
            cy.contains('Change Password').click()
            cy.contains('Current Password').should('be.visible')
            cy.contains('New Password').should('be.visible')
            cy.contains('Change Password').click()
            Account.changePassword(accountHyva.customer.password, accountHyva.tempCustomerInfo.password)
            cy.contains('You saved the account information.').should('exist')
            Account.login(accountHyva.customer.customer.email, accountHyva.tempCustomerInfo.password)
            cy.visit(accountHyva.routes.accountEdit)
            // Change password back to normal
            Account.changePassword(accountHyva.tempCustomerInfo.password, accountHyva.customer.password)
            cy.contains('You saved the account information.').should('exist')
        })

        it('Can change the profile values', () => {
            let fn = accountHyva.tempCustomerInfo.firstname,
                ln = accountHyva.tempCustomerInfo.lastname
            cy.visit(accountHyva.routes.accountEdit)
            Account.changeProfileValues(accountHyva.tempCustomerInfo.firstname, accountHyva.tempCustomerInfo.lastname)
            Account.goToProfile()
            cy.get(selectorsHyva.accountFirstnameInputSelector).should('have.value', fn)
            cy.get(selectorsHyva.accountLastnameInputSelector).should('have.value', ln)
            cy.visit(accountHyva.routes.accountEdit).then(() => {
                let fn = accountHyva.customer.customer.firstname,
                    ln = accountHyva.customer.customer.lastname
                Account.changeProfileValues(fn, ln)
                cy.visit(accountHyva.routes.accountEdit).then(() => {
                    cy.get(selectorsHyva.accountFirstnameInputSelector).should('have.value', fn)
                    cy.get(selectorsHyva.accountLastnameInputSelector).should('have.value', ln)
                })
            })
        })

        it('Can view order history', () => {
            // Testing the link has already been done
            cy.visit(accountHyva.routes.accountOrderHistory)
            cy.get('#maincontent .column.main').then(($column) => {
                if ($column[0].querySelector('.order-products-toolbar p span')) {
                    cy.log($column.find('.order-products-toolbar p span').text())
                    expect(+$column[0].querySelector('.order-products-toolbar p span').innerText.trim().slice(0,1)).to.be.at.least(1)
                } else {
                    cy.contains('You have placed no orders.').should('exist')
                }
            })
        })

        it('Can add an address', () => {
            cy.visit(accountHyva.routes.accountAddAddress)
            Account.createAddress(account.customerInfo)
            cy.contains(selectorsHyva.addNewAddressButton, 'Add New Address').click()
            cy.get(selectorsHyva.newAddressStreetInput).type(accountHyva.customerInfo.streetAddress)
            cy.get(selectorsHyva.newAddressCityInput).type(accountHyva.customerInfo.city)
            cy.get(selectorsHyva.newAddressTelInput).type(accountHyva.customerInfo.phone)
            cy.get(selectorsHyva.newAddressZipcodeInput).type(accountHyva.customerInfo.zip)
            cy.get(selectorsHyva.newAddressCountryInput).select(accountHyva.customerInfo.country)
            cy.get(selectorsHyva.newAddressRegionInput).type(accountHyva.customerInfo.state)
            cy.get(selectorsHyva.newAddressBillingInput).check()
            cy.get(selectorsHyva.newAddressShippingInput).check()
            cy.contains('Save Address').click()
        })

        it('Can change an address',  () => {
            const timeStamp = Date.now().toString()
            cy.visit(accountHyva.routes.accountAddresses)
            cy.get(selectorsHyva.editAddress).first().click()
            cy.get(selectorsHyva.addressEditStreetInput).eq(0).type(timeStamp)
            cy.get(selectorsHyva.saveAddressButton).contains('Save Address').click()
            cy.contains('You saved the address.').should('exist')
        })

        it('Can add an address automatically from saved address\'', () => {
            // There needs to be an item in the cart for this to work, and there needs to be a saved address
            cy.visit(Product.routes.simpleProduct)
            cy.contains('Add to Cart').click()
            cy.visit(Product.routes.checkout)
            cy.wait(1000) // this shouldn't be needed but for some reason it doesn't work without
            cy.get('[id^="additional.shipping_address_selected_other_option_"]').should('have.length.above', 1)
        })

        it('Can remove an address', () => {
            Account.createAddress(accountHyva.customerInfo)
            cy.visit(accountHyva.routes.accountAddresses)
            cy.get(selectorsHyva.deleteAddressButton).last().click()
            // An confirm alert pops up asking if you are sure
            cy.on('window:confirm', (str) => {
                expect(str.trim()).to.eq('Are you sure you want to delete this address?')
                return true
            })
            cy.contains('You deleted the address.').should('exist')
        })

        it('Can change the newsletter subscription', () => {
            cy.visit(accountHyva.routes.manageNewsletter)
            cy.contains('General Subscription').click()
            cy.get('#subscription').should('be.checked')
        })

        it('Can add a product the a wishlist', () => {
            cy.visit(Product.routes.simpleProduct)
            // cy.get('[aria-label="store logo"]').click()
            cy.get(selectorsHyva.addToWishlistButton).eq(0).click()
            cy.get(selectorsHyva.wishlistTitle).should('contain.text', 'My Wish List').should('exist')
            cy.visit(Product.routes.wishlist).then(() => {
                cy.get('.toolbar-number').should('exist')
                cy.contains(productHyva.simpleProductName).should('exist')
            })
        })

        it('Can edit the wishlist and remove item', () => {
            // Add comment/check qtty/send list/remove item
            cy.visit(Product.routes.wishlist)
            cy.get(selectorsHyva.wishlistItemCommentField).first().type('foobar')
            cy.get(selectorsHyva.wishlistUpdateButton).click()
            cy.get(selectorsHyva.wishlistItemCommentField).should("contain.text", 'foobar')
            cy.get(selectorsHyva.wishlistQtyField).first().then(($qty) => {
                // you would actually be sure that you are counting the item you just added
                expect($qty[0].valueAsNumber).to.be.at.least(1)
            })
            cy.get(selectorsHyva.wishlistShareButton).click()
            cy.get(selectorsHyva.wishlistShareTitle).should('contain.text', 'Wish List Sharing').should('exist')
            cy.get(selectorsHyva.wishlistShareBackLink).click()
            cy.get(selectorsHyva.wishlistRemoveItemButton).first().click().then(() => {
                cy.get(selectorsHyva.successMessage).should('contain.text', `${productHyva.simpleProductName} has been removed from your Wish List.`).should('exist')
            })
        })

        it('Can log out', () => {
            cy.get(selectorsHyva.accountIcon).click()
            cy.get(selectorsHyva.accountMenu).contains('Sign Out').click()
            cy.get(selectorsHyva.signedOutHeader).should('contain.text', 'You have signed out')
        })
    })

    describe('Guest user test', () => {
        it('Can login from cart', () => {
            cy.visit(Product.routes.simpleProduct)
            cy.get(checkoutSelectorsHyva.addToCartButton).click()
            cy.get(selectorsHyva.successMessageCartLink).contains('shopping cart').click()
            cy.visit(accountHyva.routes.accountIndex);
            Account.login(accountHyva.customer.customer.email, accountHyva.customer.password)
            // If the login fails the test will still pass without this line
            cy.get(selectorsHyva.messageContents).should('not.exist')
            cy.get(checkoutSelectorsHyva.miniCartIcon).click()
            cy.get(checkoutSelectorsHyva.cartDrawerEditLink).contains('View and Edit Cart').click()
            cy.get(checkoutSelectorsHyva.productQuantityField).and(($input) => {
                // Could pass when I should fail?
                expect($input[0].valueAsNumber).to.be.at.least(1)
            })
            cy.contains(productHyva.simpleProductName).should('exist')
        })

        it('Can login from checkout', () => {
            cy.visit(Product.routes.simpleProduct)
            cy.get(checkoutSelectorsHyva.addToCartButton).should('contain.text', 'Add to Cart').click()
            cy.visit(Product.routes.checkout)
            cy.get(checkoutSelectorsHyva.checkoutLoginToggle).click()
            cy.get(checkoutSelectorsHyva.checkoutEmailLabel).click().type(accountHyva.customer.customer.email)
            cy.get(checkoutSelectorsHyva.checkoutPasswordLabel).click().type(accountHyva.customer.password)
            cy.get(checkoutSelectorsHyva.checkoutLoginButton).click()
            cy.get(checkoutSelectorsHyva.checkoutLoggedInEmail).should('contain.text', accountHyva.customer.customer.email)
            cy.get('.message span').should('not.exist')
        })
    })
}
