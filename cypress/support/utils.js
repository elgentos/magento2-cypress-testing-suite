import globalSelectors from '../fixtures/globalSelectors.json'

export const isMobile = () => {
    return Cypress.config('viewportWidth') < Cypress.env('mobileViewportWidthBreakpoint')
}

export const isMobileHyva = () => {
    return Cypress.config('viewportWidth') < Cypress.env('mobileViewportWidthBreakpointHyva')
}

export function getWebsites() {
    return cy.request({
        method: 'GET',
        url: '/rest/V1/store/websites',
        headers: {
            authorization: `Bearer ${Cypress.env('MAGENTO2_ADMIN_TOKEN')}`
        },
    })
        .then(response => {
            return response.body
        })
}

export function shouldHavePageTitle(title) {
    cy.get(globalSelectors.pageTitle)
        .should('exist')
        .should('contain.text', title)
}

export function shouldHaveSuccessMessage(message) {
    cy.get(globalSelectors.successMessage)
        .should('exist')
        .should('contain.text', message)
}

export function shouldHaveErrorMessage(message) {
    cy.get(globalSelectors.errorMessage)
        .should('exist')
        .should('contain.text', message)
}
