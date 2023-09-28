import account from '../../../fixtures/account'
import {checkAccessibility} from "../../../support/utils"
import {Magento2RestApi} from "../../../support/magento2-rest-api";
import {Account} from "../../../page-objects/luma/account";

describe('Account index accessibility test', () => {
    it('Check account index page', () => {
        Magento2RestApi.createCustomerAccount(account.customer)
        Account.login(account.customer.customer.email, account.customer.password)

        cy.visit(account.routes.accountIndex);
        cy.injectAxe()
        checkAccessibility()
    })
})