import './commands'
import 'cypress-axe'

Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from failing the test
    return false
})

afterEach( function () {
    if (!Cypress.browser.isHeadless && this.currentTest.state === 'failed') {
        Cypress.runner.stop()
    }
})
