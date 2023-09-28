import product from '../../../fixtures/luma/product'
import checkout from '../../../fixtures/checkout'
import selectors from '../../../fixtures/luma/selectors/checkout'
import {checkAccessibility} from "../../../support/utils"
import {Magento2RestApi} from "../../../support/magento2-rest-api";
import account from "../../../fixtures/account.json";
import {Account} from "../../../page-objects/luma/account";

describe('User checkout accessibility tests', () => {
    after(() => {
        // Remove the added address
        cy.wait(4000)
        cy.visit(account.routes.accountAddresses)
        cy.wait(4000)
        cy.get('.additional-addresses a.delete').eq(0).click({force: true})
        cy.wait(1000)
        cy.get('.modal-content').contains('Are you sure you want to delete this address?')
        cy.get('.action-primary').click()
        cy.wait(2500)
    })

    it('Check Checkout steps as user', () => {
        Magento2RestApi.createCustomerAccount(account.customer)
        Account.login(account.customer.customer.email, account.customer.password)
        Account.createAddress(account.customerInfo)

        cy.visit(product.simpleProductUrl)
        cy.get(selectors.addToCartButton).click()

        cy.wait(3000)
        cy.visit(checkout.checkoutUrl)
        cy.wait(5000)

        cy.injectAxe()
        // We need to set skip failures as true here otherwise the tests will not proceed to the next checkout step
        checkAccessibility(null, null, true)

        cy.wait(3000)
        cy.get('.button.action.continue.primary').click()
        cy.wait(5000)

        cy.injectAxe()
        // We need to set skip failures as true here so the after gets called
        checkAccessibility(null, null, true)
    })
})
