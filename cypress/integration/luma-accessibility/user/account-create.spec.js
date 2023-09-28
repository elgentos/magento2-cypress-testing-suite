import account from '../../../fixtures/account'
import {checkAccessibility} from "../../../support/utils"

describe('Account test creation', () => {
    it('Check create an account page', () => {
        cy.visit(account.routes.accountCreate)
        cy.injectAxe()
        checkAccessibility()
    })
})