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
        timeout: 100000,
    })
        .then(response => {
            return response.body
        })
}
