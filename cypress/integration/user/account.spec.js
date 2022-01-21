import {Account} from '../../page-objects/account'
import {Product} from '../../page-objects/product'
import {Magento2RestApi} from '../../support/magento2-rest-api'
import account from '../../fixtures/account'
import product from '../../fixtures/product'
import selectors from '../../fixtures/selectors/luma/account'
import checkoutSelectors from '../../fixtures/selectors/luma/checkout'

describe('Account test creation', () => {
    it('Can create an account', () => {
        cy.visit(account.routes.accountCreate)
        Account.createNewCustomer(account.customer.customer.firstname, account.customer.customer.lastname, Date.now() + account.customer.customer.email, account.customer.password)
        cy.contains('Vielen Dank für die Registrierung bei Main Website Store.').should('exist')
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
        // This no longer seems to work...
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
        cy.get('.modal-content').contains('Sind Sie sicher, dass Sie diese Adresse löschen möchten?')
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
        cy.contains('Aktuelles Passwort').should('be.visible')
        cy.contains('Neues Passwort ').should('be.visible')
        Account.changePassword(account.customer.password, account.tempCustomerInfo.password)
        cy.contains('Konto-Informationen wurden gespeichert.').should('exist')
        Account.login(account.customer.customer.email, account.tempCustomerInfo.password)
        cy.visit(account.routes.accountEdit)
        // Change password back to normal
        cy.get('#change-password').check({force: true})
        Account.changePassword(account.tempCustomerInfo.password, account.customer.password)
        cy.contains('Konto-Informationen wurden gespeichert.').should('exist')
    })

    it('Can change the profile values', () => {
        let fn = account.tempCustomerInfo.firstname,
            ln = account.tempCustomerInfo.lastname
        cy.visit(account.routes.accountEdit)
        Account.changeProfileValues(account.tempCustomerInfo.firstname, account.tempCustomerInfo.lastname)
        Account.goToProfile()
        cy.get(selectors.accountFirstnameInputSelector).should('have.value', fn)
        cy.get(selectors.accountLastnameInputSelector).should('have.value', ln)
        cy.visit(account.routes.accountEdit).then(() => {
            let fn = account.customer.customer.firstname,
                ln = account.customer.customer.lastname
            Account.changeProfileValues(fn, ln)
            cy.visit(account.routes.accountEdit).then(() => {
                cy.get(selectors.accountFirstnameInputSelector).should('have.value', fn)
                cy.get(selectors.accountLastnameInputSelector).should('have.value', ln)
            })
        })
    })

    it('Can view order history', () => {
        // Testing the link has already been done
        cy.visit(account.routes.accountOrderHistory)
        cy.get('#maincontent .column.main').then(($column) => {
            if ($column[0].querySelector('.order-products-toolbar p span')) {
                cy.log($column.find('.order-products-toolbar p span').text())
                expect(+$column[0].querySelector('.order-products-toolbar p span').innerText.trim().slice(0,1)).to.be.at.least(1)
            } else {
                cy.contains('Your search did not return any results.').should('exist')
            }
        })
    })

    it('Can add an address', () => {
        cy.visit(account.routes.accountAddAddress)
        Account.createAddress(account.customerInfo)
        cy.wait(2000)
        cy.contains(selectors.addNewAddressButton, 'Neue Adresse hinzufügen').click()
        cy.get(selectors.newAddressStreetInput).type(account.customerInfo.streetAddress)
        cy.get(selectors.newAddressCityInput).type(account.customerInfo.city)
        cy.get(selectors.newAddressTelInput).type(account.customerInfo.phone)
        cy.get(selectors.newAddressZipcodeInput).type(account.customerInfo.zip)
        cy.get(selectors.newAddressCountryInput).select(account.customerInfo.country)
        cy.contains('Adresse speichern').click()
    })

    it('Can change an address',  () => {
        const timeStamp = Date.now().toString()
        cy.visit(account.routes.accountAddresses)
        cy.get(selectors.editAddress).first().click()
        cy.get(selectors.addressEditStreetInput).eq(0).type(timeStamp)
        cy.get(selectors.saveAddressButton).contains('Adresse speichern').click()
        cy.contains('Sie haben die Adresse gespeichert.').should('exist')
    })

    it('Can add an address automatically from saved address', () => {
        // There needs to be an item in the cart for this to work, and there needs to be a saved address
        cy.visit(Product.routes.simpleProduct)
        cy.contains('In den Warenkorb').click()
        cy.wait(3000)
        cy.visit(Product.routes.checkout)
        cy.wait(7000) // this shouldn't be needed but for some reason it doesn't work without
        cy.get('.shipping-address-item.selected-item').should('have.length', 1)
    })

    it('Can remove an address', () => {
        Account.createAddress(account.customerInfo)
        cy.visit(account.routes.accountAddresses)
        cy.wait(4000)
        cy.get(selectors.deleteAddressButton).eq(0).click({force: true})
        // An confirm alert pops up asking if you are sure
        cy.contains('.modal-content', 'Sind Sie sicher, dass Sie diese Adresse löschen möchten?')
        cy.get('.action-primary').click()
        cy.contains('Sie haben die Adresse gelöscht.').should('exist')
    })

    it('Can change the newsletter subscription', () => {
        cy.visit(account.routes.manageNewsletter)
        cy.contains('Allgemeine Abo')
        cy.get('#subscription').should('be.checked')
    })

    it('Can add a product the a wishlist', () => {
        cy.visit(Product.routes.simpleProduct)
        cy.wait(2000)
        cy.get(selectors.addToWishlistButton).eq(0).click({force: true})
        cy.get(selectors.wishlistTitle).should('contain.text', 'Wunschliste').should('exist')
        cy.visit(Product.routes.wishlist).then(() => {
            cy.get('.toolbar-number').should('exist')
            cy.contains(product.simpleProductName).should('exist')
        })
    })

    it('Can log out', () => {
        cy.get(selectors.accountIcon).click({force: true})
        cy.get(selectors.accountMenu).contains('Abmelden').click({force: true})
        cy.get(selectors.signedOutHeader).should('contain.text', 'Sie sind abgemeldet')
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
        cy.get(selectors.successMessageCartLink).contains('Warenkorb').click()
        cy.visit(account.routes.accountIndex);
        cy.wait(4000)
        Account.login(account.customer.customer.email, account.customer.password)
        // If the login fails the test will still pass without this line
        cy.get(selectors.messageContents).should('not.exist')
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
        cy.get(checkoutSelectors.addToCartButton).should('contain.text', 'In den Warenkorb').click()
        cy.visit(Product.routes.checkout)
        cy.wait(4000)
        cy.get('button[data-role="proceed-to-checkout"]').click({force: true})
        cy.wait(5000)
        cy.get(checkoutSelectors.checkoutEmailLabel).type(account.customer.customer.email)
        cy.wait(4000)
        cy.get(checkoutSelectors.checkoutPasswordLabel).type(account.customer.password)
        cy.wait(1000)
        cy.get('button[data-action="checkout-method-login"]').click()
    })
})
