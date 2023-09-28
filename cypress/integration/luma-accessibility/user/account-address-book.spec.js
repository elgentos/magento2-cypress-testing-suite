import account from '../../../fixtures/account'
import {checkAccessibility} from "../../../support/utils"
import {Magento2RestApi} from "../../../support/magento2-rest-api";
import {Account} from "../../../page-objects/luma/account";

describe('Account address book accessibility test', () => {
    before(() => {
        cy.wait(2500)
        Magento2RestApi.createCustomerAccount(account.customer)
        Account.login(account.customer.customer.email, account.customer.password)
        Account.createAddress(account.customerInfo)
    })

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

    it('Check address book page', () => {
        cy.visit(account.routes.accountAddAddress)
        Account.createAddress(account.customerInfo)
        cy.wait(2000)

        cy.visit(account.routes.accountAddresses)
        cy.injectAxe()

        // We need to set skip failures as true here so the after gets called
        checkAccessibility(null, null, true)
    })
})