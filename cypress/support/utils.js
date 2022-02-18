export const isMobile = () => {
    return Cypress.config("viewportWidth") < Cypress.env("mobileViewportWidthBreakpoint");
};

export const isMobileHyva = () => {
    return Cypress.config("viewportWidth") < Cypress.env("mobileViewportWidthBreakpointHyva");
};
