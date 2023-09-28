import account from '../../../fixtures/account'
import {checkAccessibility} from "../../../support/utils"

describe('Account login accessibility test', () => {
    it('Check login page', () => {
        cy.visit(account.routes.accountIndex);
        cy.injectAxe()
        checkAccessibility()
    })
})