import './commands'

Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from failing the test
    return false
})

afterEach( function () {
    if (this.currentTest.state === 'failed') {
        Cypress.runner.stop()
    }
});


