import account from '../../../fixtures/account'
import {checkAccessibility} from "../../../support/utils"
import {Magento2RestApi} from "../../../support/magento2-rest-api";
import {Account} from "../../../page-objects/luma/account";
import selectorsLuma from "../../../fixtures/luma/selectors/account.json";

describe('Account logout accessibility test', () => {
    it('Check logout page', () => {
        Magento2RestApi.createCustomerAccount(account.customer)
        Account.login(account.customer.customer.email, account.customer.password)

        cy.get(selectorsLuma.accountIcon).click({force: true})
        cy.get(selectorsLuma.accountMenuItems).contains('Sign Out').click({force: true})
        cy.injectAxe()
        checkAccessibility()
    })
})