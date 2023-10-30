import account from '../../../fixtures/account'
import {checkAccessibility} from "../../../support/utils"

describe('Account forgotten password accessibility test', () => {
    it('Check forgotten password page', () => {
        cy.visit(account.routes.accountForgottenPassword);
        cy.injectAxe()
        checkAccessibility()
    })
})