import account from '../../../fixtures/account'
import {checkAccessibility} from "../../../support/utils"
import {Magento2RestApi} from "../../../support/magento2-rest-api";
import {Account} from "../../../page-objects/luma/account";

describe('Account order history accessibility test', () => {
    it('Check order history page', () => {
        Magento2RestApi.createCustomerAccount(account.customer)
        Account.login(account.customer.customer.email, account.customer.password)

        // This test is dependent on if the user has or does not have orders
        cy.visit(account.routes.accountOrderHistory)
        cy.injectAxe()
        checkAccessibility()
    })
})