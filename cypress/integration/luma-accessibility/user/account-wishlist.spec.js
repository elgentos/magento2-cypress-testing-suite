import account from '../../../fixtures/account'
import {checkAccessibility} from "../../../support/utils"
import {Magento2RestApi} from "../../../support/magento2-rest-api";
import {Account} from "../../../page-objects/luma/account";
import product from "../../../fixtures/luma/product.json";
import selectorsLuma from "../../../fixtures/luma/selectors/account.json";

describe('Account wishlist accessibility test', () => {
    it('Check wishlist page', () => {
        Magento2RestApi.createCustomerAccount(account.customer)
        Account.login(account.customer.customer.email, account.customer.password)

        cy.visit(product.simpleProductUrl)
        cy.wait(2000)
        cy.get(selectorsLuma.addToWishlistButton).eq(0).click({force: true})
        cy.visit(account.routes.wishlist)
        cy.injectAxe()
        checkAccessibility()
    })
})